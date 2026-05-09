const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const handler = require('../src/app');
const store = require('../src/data/store');

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.beforeEach(() => store.reset());

async function api(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const body = await res.json();
  return { res, body };
}

test('health endpoint returns ok', async () => {
  const { res, body } = await api('/health');
  assert.equal(res.status, 200);
  assert.equal(body.status, 'ok');
});

test('customer can register, get recommendations, book, pay, and review', async () => {
  const register = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Asha', email: 'asha@example.com', password: 'password123', phone: '+91-9000000022' })
  });
  assert.equal(register.res.status, 201);
  const token = register.body.token;

  const recs = await api('/api/recommendations?category=electrician&location=Bengaluru');
  assert.equal(recs.res.status, 200);
  assert.ok(recs.body.providers.length >= 1);

  const booking = await api('/api/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ providerId: recs.body.providers[0].id, service: 'Fan installation', scheduledAt: '2026-05-10T10:00:00.000Z', address: 'MG Road, Bengaluru' })
  });
  assert.equal(booking.res.status, 201);
  assert.equal(booking.body.booking.status, 'pending');

  const payment = await api('/api/payments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bookingId: booking.body.booking.id, amount: booking.body.booking.priceEstimate })
  });
  assert.equal(payment.res.status, 201);
  assert.equal(payment.body.payment.status, 'captured');

  const review = await api('/api/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ providerId: recs.body.providers[0].id, rating: 5, comment: 'Very professional and completed the repair on time.' })
  });
  assert.equal(review.res.status, 201);
  assert.equal(review.body.review.status, 'published');
});

test('admin summary is protected', async () => {
  const blocked = await api('/api/admin/summary');
  assert.equal(blocked.res.status, 401);

  const login = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@smartlocal.test', password: 'password' })
  });
  assert.equal(login.res.status, 200);

  const summary = await api('/api/admin/summary', { headers: { Authorization: `Bearer ${login.body.token}` } });
  assert.equal(summary.res.status, 200);
  assert.equal(summary.body.providers, 3);
});
