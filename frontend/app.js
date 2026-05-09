const API = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let token = localStorage.getItem('token') || '';
let currentUser = null;
let authMode = 'login';
let providers = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const out = (value) => { $('#output').textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2); };

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function setFeatureAccess(isSignedIn) {
  $$('.requires-auth').forEach((section) => {
    section.classList.toggle('locked', !isSignedIn);
    section.querySelectorAll('input, select, textarea, button').forEach((control) => {
      control.disabled = !isSignedIn;
    });
  });
}

function updateSession(user = null, newToken = token) {
  currentUser = user;
  token = newToken || '';

  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');

  $('#sessionLabel').textContent = user ? `${user.name} (${user.role})` : 'Guest';
  $('#authStatus').textContent = user ? 'Signed in' : 'Signed out';
  $('#authStatus').classList.toggle('success', Boolean(user));
  $('#logoutBtn').classList.toggle('hidden', !user);
  setFeatureAccess(Boolean(user));
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  $('#loginTab').classList.toggle('active', !isRegister);
  $('#registerTab').classList.toggle('active', isRegister);
  $('#loginTab').setAttribute('aria-selected', String(!isRegister));
  $('#registerTab').setAttribute('aria-selected', String(isRegister));
  $$('.register-only').forEach((item) => item.classList.toggle('hidden', !isRegister));
  $('#authSubmit').textContent = isRegister ? 'Create account' : 'Login';
  $('#passwordInput').autocomplete = isRegister ? 'new-password' : 'current-password';
  $('#nameInput').required = isRegister;
}

function validateAuthForm(form) {
  const email = String(form.email || '').trim();
  const password = String(form.password || '');
  if (!email.includes('@')) return 'Please enter a valid email address.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (authMode === 'register' && !String(form.name || '').trim()) return 'Please enter your full name to register.';
  return '';
}

async function authenticate() {
  const form = Object.fromEntries(new FormData($('#authForm')));
  const validationError = validateAuthForm(form);
  if (validationError) {
    out(validationError);
    return;
  }

  const path = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
  const data = await api(path, { method: 'POST', body: JSON.stringify(form) });
  updateSession(data.user, data.token);
  out(data);
  await searchProviders();
  await refreshBookings();
}

async function restoreSession() {
  if (!token) {
    updateSession(null, '');
    return;
  }

  try {
    const data = await api('/api/me');
    updateSession(data.user, token);
  } catch (_err) {
    updateSession(null, '');
  }
}

async function loadCategories() {
  const data = await api('/api/categories');
  const options = data.categories.map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
  $('#categorySelect').insertAdjacentHTML('beforeend', options);
}

function renderProviders(items) {
  providers = items;
  $('#providerCount').textContent = `${items.length} provider${items.length === 1 ? '' : 's'}`;
  $('#providerSelect').innerHTML = items.map((provider) => `<option value="${provider.id}">${provider.name}</option>`).join('');
  $('#reviewProviderSelect').innerHTML = $('#providerSelect').innerHTML;
  $('#providers').innerHTML = items.map((provider) => `
    <article class="provider">
      <div class="provider-title">
        <h3>${provider.name}</h3>
        <strong>₹${provider.priceFrom}+</strong>
      </div>
      <p class="muted">${provider.category} • ${provider.location} • ${provider.availability}</p>
      <p>${provider.bio}</p>
      <span class="badge">⭐ ${provider.rating} (${provider.reviewCount})</span>
      ${provider.verified ? '<span class="badge">Verified</span>' : '<span class="badge neutral">Pending verification</span>'}
      ${provider.emergencyAvailable ? '<span class="badge urgent">Emergency</span>' : ''}
      <p class="muted">${(provider.services || []).join(', ')}</p>
    </article>`).join('') || '<p>No providers found. Try another category or location.</p>';
}

async function searchProviders(event) {
  event?.preventDefault();
  const form = new FormData($('#searchForm'));
  const params = new URLSearchParams();
  for (const [key, value] of form.entries()) if (value && value !== 'on') params.set(key, value);
  if (form.get('emergency')) params.set('emergency', 'true');
  const data = await api(`/api/recommendations?${params}`);
  renderProviders(data.providers);
  out(data);
}

async function refreshBookings() {
  if (!token) return;
  const data = await api('/api/bookings');
  $('#bookings').innerHTML = data.bookings.map((booking) => `
    <article class="booking">
      <strong>${booking.service}</strong>
      <p class="muted">${booking.status} • ${new Date(booking.scheduledAt).toLocaleString()}</p>
      <p>Estimate: ₹${booking.priceEstimate} ${booking.paymentStatus === 'paid' ? '• Paid' : ''}</p>
      <button class="secondary" onclick="pay('${booking.id}', ${booking.priceEstimate})" ${booking.paymentStatus === 'paid' ? 'disabled' : ''}>Pay test amount</button>
    </article>`).join('') || '<p>No bookings yet.</p>';
  out(data);
}

async function pay(bookingId, amount) {
  const data = await api('/api/payments', { method: 'POST', body: JSON.stringify({ bookingId, amount }) });
  out(data);
  await refreshBookings();
}
window.pay = pay;

$('#authForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await authenticate();
  } catch (err) {
    out(err.message);
  }
});

$('#loginTab').addEventListener('click', () => setAuthMode('login'));
$('#registerTab').addEventListener('click', () => setAuthMode('register'));
$('#logoutBtn').addEventListener('click', () => {
  updateSession(null, '');
  $('#bookings').innerHTML = '';
  out('Signed out. Login again to book, pay, and review providers.');
});

$('#togglePassword').addEventListener('click', () => {
  const input = $('#passwordInput');
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  $('#togglePassword').textContent = showing ? 'Show' : 'Hide';
  $('#togglePassword').setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

$$('.demo-login').forEach((button) => {
  button.addEventListener('click', async () => {
    setAuthMode('login');
    $('#emailInput').value = button.dataset.email;
    $('#passwordInput').value = 'password';
    await authenticate();
  });
});

$('#searchForm').addEventListener('submit', searchProviders);
$('#refreshBookings').addEventListener('click', refreshBookings);

$('#bookingForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  form.emergency = Boolean(form.emergency);
  form.scheduledAt = new Date(form.scheduledAt).toISOString();
  const data = await api('/api/bookings', { method: 'POST', body: JSON.stringify(form) });
  out(data);
  await refreshBookings();
});

$('#reviewForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  form.rating = Number(form.rating);
  const data = await api('/api/reviews', { method: 'POST', body: JSON.stringify(form) });
  out(data);
  await searchProviders();
});

(async function init() {
  try {
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setMinutes(0, 0, 0);
    document.querySelector('[name="scheduledAt"]').value = tomorrow.toISOString().slice(0, 16);
    setAuthMode('login');
    await restoreSession();
    await loadCategories();
    if (token) {
      await searchProviders();
      await refreshBookings();
    } else {
      renderProviders([]);
      out('Login with a demo account or register to use all features.');
    }
  } catch (err) {
    out(`Backend is not reachable yet (${err.message}). Start it with: cd backend && npm install && npm start`);
  }
})();
