const API = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let token = localStorage.getItem('token') || '';
let providers = [];

const $ = (selector) => document.querySelector(selector);
const out = (value) => { $('#output').textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2); };

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function setSession(user, newToken) {
  token = newToken;
  localStorage.setItem('token', token);
  $('#sessionLabel').textContent = `${user.name} (${user.role})`;
}

async function loadCategories() {
  const data = await api('/api/categories');
  const options = data.categories.map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
  $('#categorySelect').insertAdjacentHTML('beforeend', options);
}

function renderProviders(items) {
  providers = items;
  $('#providerSelect').innerHTML = items.map((provider) => `<option value="${provider.id}">${provider.name}</option>`).join('');
  $('#reviewProviderSelect').innerHTML = $('#providerSelect').innerHTML;
  $('#providers').innerHTML = items.map((provider) => `
    <article class="provider">
      <h3>${provider.name}</h3>
      <p class="muted">${provider.category} • ${provider.location}</p>
      <p>${provider.bio}</p>
      <span class="badge">⭐ ${provider.rating}</span>
      ${provider.recommendationScore ? `<span class="badge">AI ${provider.recommendationScore}</span>` : ''}
      ${provider.verified ? '<span class="badge">Verified</span>' : ''}
      ${provider.emergencyAvailable ? '<span class="badge">Emergency</span>' : ''}
      <p><strong>From ₹${provider.priceFrom}</strong></p>
      <p class="muted">${(provider.services || []).join(', ')}</p>
    </article>`).join('') || '<p>No providers found.</p>';
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
  const data = await api('/api/bookings');
  $('#bookings').innerHTML = data.bookings.map((booking) => `
    <article class="booking">
      <strong>${booking.service}</strong>
      <p class="muted">${booking.status} • ${new Date(booking.scheduledAt).toLocaleString()}</p>
      <p>Estimate: ₹${booking.priceEstimate}</p>
      <button class="secondary" onclick="pay('${booking.id}', ${booking.priceEstimate})">Pay test amount</button>
    </article>`).join('') || '<p>No bookings yet.</p>';
  out(data);
}

async function pay(bookingId, amount) {
  const data = await api('/api/payments', { method: 'POST', body: JSON.stringify({ bookingId, amount }) });
  out(data);
  await refreshBookings();
}
window.pay = pay;

async function loadAdminDashboard() {
  const [summary, providerData] = await Promise.all([api('/api/admin/summary'), api('/api/providers')]);
  $('#adminStats').innerHTML = Object.entries(summary).map(([key, value]) => `<article class="stat"><span>${key}</span><strong>${value}</strong></article>`).join('');
  $('#adminProviders').innerHTML = providerData.providers.map((provider) => `
    <article class="provider admin-provider">
      <div>
        <h3>${provider.name}</h3>
        <p class="muted">${provider.category} • ${provider.location} • Verified: ${provider.verified}</p>
      </div>
      <button class="secondary" onclick="verifyProvider('${provider.id}', ${!provider.verified})">${provider.verified ? 'Unverify' : 'Verify'}</button>
    </article>`).join('');
  out({ summary, providers: providerData.providers });
}

async function verifyProvider(providerId, verified) {
  const data = await api(`/api/providers/${providerId}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) });
  out(data);
  await loadAdminDashboard();
  await searchProviders();
}
window.verifyProvider = verifyProvider;

$('#loginBtn').addEventListener('click', async () => {
  const form = Object.fromEntries(new FormData($('#authForm')));
  const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
  setSession(data.user, data.token);
  out(data);
});

$('#registerBtn').addEventListener('click', async () => {
  const form = Object.fromEntries(new FormData($('#authForm')));
  const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
  setSession(data.user, data.token);
  out(data);
});

$('#searchForm').addEventListener('submit', searchProviders);
$('#refreshBookings').addEventListener('click', refreshBookings);
$('#loadAdmin').addEventListener('click', () => loadAdminDashboard().catch((err) => out(`Admin load failed: ${err.message}. Login as admin@smartlocal.test first.`)));

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

$('#mlForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  const data = await api('/api/ml/detect-review', { method: 'POST', body: JSON.stringify(form) });
  $('#mlResult').innerHTML = `<p><strong>${data.isSuspicious ? 'Suspicious' : 'Looks authentic'}</strong> (${Math.round(data.confidence * 100)}% confidence)</p><p class="muted">${data.reason}</p>`;
  out(data);
});

(async function init() {
  try {
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setMinutes(0, 0, 0);
    document.querySelector('[name="scheduledAt"]').value = tomorrow.toISOString().slice(0, 16);
    await loadCategories();
    await searchProviders();
  } catch (err) {
    out(`Backend is not reachable yet (${err.message}). Start it with: cd backend && npm start`);
  }
})();
