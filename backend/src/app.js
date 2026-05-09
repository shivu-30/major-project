const { URL } = require('url');
const { read, write, id } = require('./data/store');
const { hashPassword, signToken, verifyToken, publicUser } = require('./services/auth');
const { recommend, detectFakeReview } = require('./services/recommendations');

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error('Request body too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (_err) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function getUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return verifyToken(token);
}

function requireUser(req, res) {
  const user = getUser(req);
  if (!user) send(res, 401, { error: 'Authentication required' });
  return user;
}

function requireAdmin(req, res) {
  const user = requireUser(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    send(res, 403, { error: 'Insufficient permissions' });
    return null;
  }
  return user;
}

function pathMatch(pathname, pattern) {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    if (patternParts[i].startsWith(':')) params[patternParts[i].slice(1)] = pathParts[i];
    else if (patternParts[i] !== pathParts[i]) return null;
  }
  return params;
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const query = Object.fromEntries(url.searchParams.entries());

  try {
    if (req.method === 'GET' && pathname === '/health') {
      return send(res, 200, { status: 'ok', service: 'smart-service-finder-backend', timestamp: new Date().toISOString() });
    }

    if (req.method === 'GET' && pathname === '/api/categories') return send(res, 200, { categories: read().categories });

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await readBody(req);
      const { name, email, phone, password, role = 'customer' } = body;
      if (!name || !email || !password) return send(res, 400, { error: 'name, email, and password are required' });
      if (!['customer', 'provider', 'admin'].includes(role)) return send(res, 400, { error: 'Invalid role' });
      const db = read();
      if (db.users.some((user) => user.email.toLowerCase() === String(email).toLowerCase())) return send(res, 409, { error: 'Email already registered' });
      const user = { id: id(role), name, email: String(email).toLowerCase(), phone: phone || '', role, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
      db.users.push(user);
      write(db);
      return send(res, 201, { user: publicUser(user), token: signToken(user) });
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req);
      const db = read();
      const user = db.users.find((item) => item.email.toLowerCase() === String(body.email || '').toLowerCase());
      const matchesDemo = user && user.passwordHash === 'demo' && body.password === 'password';
      const matchesHash = user && user.passwordHash === hashPassword(body.password || '');
      if (!user || (!matchesDemo && !matchesHash)) return send(res, 401, { error: 'Invalid email or password' });
      return send(res, 200, { user: publicUser(user), token: signToken(user) });
    }

    if (req.method === 'GET' && pathname === '/api/me') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const user = read().users.find((item) => item.id === authUser.id);
      return send(res, 200, { user: publicUser(user) });
    }

    if (req.method === 'GET' && pathname === '/api/providers') {
      let providers = read().providers;
      if (query.category) providers = providers.filter((provider) => provider.category === query.category);
      if (query.location) providers = providers.filter((provider) => provider.location.toLowerCase().includes(String(query.location).toLowerCase()));
      if (query.verified !== undefined) providers = providers.filter((provider) => provider.verified === (query.verified === 'true'));
      if (query.emergency !== undefined) providers = providers.filter((provider) => provider.emergencyAvailable === (query.emergency === 'true'));
      if (query.q) {
        const term = String(query.q).toLowerCase();
        providers = providers.filter((provider) => [provider.name, provider.ownerName, provider.category, provider.location, provider.bio, ...provider.services].join(' ').toLowerCase().includes(term));
      }
      return send(res, 200, { providers });
    }

    if (req.method === 'POST' && pathname === '/api/providers') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const body = await readBody(req);
      if (!body.name || !body.category || !body.location) return send(res, 400, { error: 'name, category, and location are required' });
      const db = read();
      const provider = {
        id: id('provider'), name: body.name, ownerName: body.ownerName || authUser.email, category: body.category, location: body.location,
        latitude: Number(body.latitude || 0), longitude: Number(body.longitude || 0), rating: 0, reviewCount: 0, verified: authUser.role === 'admin',
        emergencyAvailable: Boolean(body.emergencyAvailable), priceFrom: Number(body.priceFrom || 0),
        services: Array.isArray(body.services) ? body.services : String(body.services || '').split(',').map((s) => s.trim()).filter(Boolean),
        bio: body.bio || '', availability: body.availability || '09:00-18:00', createdAt: new Date().toISOString()
      };
      db.providers.push(provider); write(db);
      return send(res, 201, { provider });
    }

    const verifyParams = pathMatch(pathname, '/api/providers/:id/verify');
    if (req.method === 'PATCH' && verifyParams) {
      const admin = requireAdmin(req, res); if (!admin) return;
      const body = await readBody(req);
      const db = read();
      const provider = db.providers.find((item) => item.id === verifyParams.id);
      if (!provider) return send(res, 404, { error: 'Provider not found' });
      provider.verified = Boolean(body.verified ?? true); write(db);
      return send(res, 200, { provider });
    }

    if (req.method === 'GET' && pathname === '/api/recommendations') {
      return send(res, 200, { providers: recommend(read().providers, { category: query.category, location: query.location, emergency: query.emergency === 'true' }) });
    }


    if (req.method === 'POST' && pathname === '/api/ml/recommend') {
      const body = await readBody(req);
      const db = read();
      const sourceProviders = Array.isArray(body.providers) ? body.providers : db.providers;
      const providers = recommend(sourceProviders, { category: body.category, location: body.location, emergency: Boolean(body.emergency) });
      return send(res, 200, { providers, engine: 'backend-integrated-heuristic' });
    }

    if (req.method === 'POST' && pathname === '/api/ml/detect-review') {
      const body = await readBody(req);
      return send(res, 200, { ...detectFakeReview(body.text || body.comment || ''), engine: 'backend-integrated-heuristic' });
    }

    if (req.method === 'POST' && pathname === '/api/bookings') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const body = await readBody(req);
      if (!body.providerId || !body.service || !body.scheduledAt || !body.address) return send(res, 400, { error: 'providerId, service, scheduledAt, and address are required' });
      const db = read();
      const provider = db.providers.find((item) => item.id === body.providerId);
      if (!provider) return send(res, 404, { error: 'Provider not found' });
      const booking = { id: id('booking'), customerId: authUser.id, providerId: body.providerId, service: body.service, scheduledAt: body.scheduledAt, address: body.address, emergency: Boolean(body.emergency), notes: body.notes || '', status: 'pending', priceEstimate: provider.priceFrom + (body.emergency ? 250 : 0), createdAt: new Date().toISOString() };
      db.bookings.push(booking);
      db.notifications.push({ id: id('notification'), userId: authUser.id, message: `Booking created with ${provider.name}`, read: false, createdAt: booking.createdAt });
      write(db);
      return send(res, 201, { booking });
    }

    if (req.method === 'GET' && pathname === '/api/bookings') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const db = read();
      const bookings = authUser.role === 'admin' ? db.bookings : db.bookings.filter((booking) => booking.customerId === authUser.id || booking.providerId === query.providerId);
      return send(res, 200, { bookings });
    }

    const bookingStatusParams = pathMatch(pathname, '/api/bookings/:id/status');
    if (req.method === 'PATCH' && bookingStatusParams) {
      const authUser = requireUser(req, res); if (!authUser) return;
      const body = await readBody(req);
      const allowed = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled'];
      if (!allowed.includes(body.status)) return send(res, 400, { error: 'Invalid booking status' });
      const db = read();
      const booking = db.bookings.find((item) => item.id === bookingStatusParams.id);
      if (!booking) return send(res, 404, { error: 'Booking not found' });
      booking.status = body.status; booking.updatedAt = new Date().toISOString(); write(db);
      return send(res, 200, { booking });
    }

    if (req.method === 'POST' && pathname === '/api/payments') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const body = await readBody(req);
      if (!body.bookingId || !body.amount) return send(res, 400, { error: 'bookingId and amount are required' });
      const db = read();
      const booking = db.bookings.find((item) => item.id === body.bookingId);
      if (!booking) return send(res, 404, { error: 'Booking not found' });
      const payment = { id: id('payment'), bookingId: body.bookingId, customerId: authUser.id, amount: Number(body.amount), method: body.method || 'test', status: 'captured', createdAt: new Date().toISOString() };
      db.payments.push(payment); booking.paymentStatus = 'paid'; write(db);
      return send(res, 201, { payment });
    }

    if (req.method === 'POST' && pathname === '/api/reviews') {
      const authUser = requireUser(req, res); if (!authUser) return;
      const body = await readBody(req);
      if (!body.providerId || !body.rating || !body.comment) return send(res, 400, { error: 'providerId, rating, and comment are required' });
      const db = read();
      const provider = db.providers.find((item) => item.id === body.providerId);
      if (!provider) return send(res, 404, { error: 'Provider not found' });
      const moderation = detectFakeReview(body.comment);
      const review = { id: id('review'), providerId: body.providerId, customerId: authUser.id, rating: Number(body.rating), comment: body.comment, moderation, status: moderation.isSuspicious ? 'flagged' : 'published', createdAt: new Date().toISOString() };
      db.reviews.push(review);
      const published = db.reviews.filter((item) => item.providerId === body.providerId && item.status === 'published');
      provider.reviewCount = published.length;
      provider.rating = published.length ? Number((published.reduce((sum, item) => sum + item.rating, 0) / published.length).toFixed(1)) : provider.rating;
      write(db);
      return send(res, 201, { review });
    }

    if (req.method === 'GET' && pathname === '/api/reviews') {
      const reviews = read().reviews.filter((review) => !query.providerId || review.providerId === query.providerId);
      return send(res, 200, { reviews });
    }

    if (req.method === 'GET' && pathname === '/api/admin/summary') {
      const admin = requireAdmin(req, res); if (!admin) return;
      const db = read();
      return send(res, 200, { users: db.users.length, providers: db.providers.length, verifiedProviders: db.providers.filter((provider) => provider.verified).length, bookings: db.bookings.length, payments: db.payments.length, flaggedReviews: db.reviews.filter((review) => review.status === 'flagged').length });
    }

    return send(res, 404, { error: `Route not found: ${req.method} ${pathname}` });
  } catch (err) {
    return send(res, err.message === 'Invalid JSON body' ? 400 : 500, { error: err.message || 'Internal server error' });
  }
}

module.exports = handler;
