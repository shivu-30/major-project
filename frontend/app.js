const API = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let token = localStorage.getItem('token') || '';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let providers = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const out = (value) => {
  const output = $('#output');
  if (output) output.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};

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
  currentUser = user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  updateSessionLabel();
}

function updateSessionLabel() {
  const label = $('#sessionLabel');
  if (!label) return;
  label.textContent = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Guest';
}

function setupNavigation() {
  const page = document.body.dataset.page;
  $$('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) link.classList.add('active');
  });
  $('#menuToggle')?.addEventListener('click', () => $('#navLinks')?.classList.toggle('open'));
}

function goToNextPageFor(user) {
  if (user.role === 'admin') window.location.href = 'admin.html';
  else window.location.href = 'search.html';
}

async function loadCategories() {
  const selects = $$('#categorySelect');
  if (!selects.length) return;
  const data = await api('/api/categories');
  const options = data.categories.map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
  selects.forEach((select) => {
    if (select.options.length <= 1) select.insertAdjacentHTML('beforeend', options);
  });
}

async function loadProviderOptions() {
  const selects = ['#providerSelect', '#reviewProviderSelect'].map((selector) => $(selector)).filter(Boolean);
  if (!selects.length) return;
  const data = await api('/api/providers');
  providers = data.providers;
  const options = providers.map((provider) => `<option value="${provider.id}">${provider.name} — ${provider.category}</option>`).join('');
  selects.forEach((select) => { select.innerHTML = options; });
  const providerId = new URLSearchParams(window.location.search).get('providerId');
  if (providerId) selects.forEach((select) => { select.value = providerId; });
}

function renderProviders(items) {
  providers = items;
  const container = $('#providers');
  if (!container) return;
  container.innerHTML = items.map((provider) => `
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
      <div class="card-actions">
        <a class="button-link" href="bookings.html?providerId=${provider.id}">Book</a>
        <a class="button-link secondary-link" href="reviews.html?providerId=${provider.id}">Review</a>
      </div>
    </article>`).join('') || '<p class="empty-state">No providers found.</p>';
}

async function searchProviders(event) {
  event?.preventDefault();
  const formEl = $('#searchForm');
  if (!formEl) return;
  const form = new FormData(formEl);
  const params = new URLSearchParams();
  for (const [key, value] of form.entries()) if (value && value !== 'on') params.set(key, value);
  if (form.get('emergency')) params.set('emergency', 'true');
  const data = await api(`/api/recommendations?${params}`);
  renderProviders(data.providers);
  out(data);
}

async function refreshBookings() {
  const container = $('#bookings');
  if (!container) return;
  const data = await api('/api/bookings');
  container.innerHTML = data.bookings.map((booking) => `
    <article class="booking">
      <strong>${booking.service}</strong>
      <p class="muted">${booking.status} • ${new Date(booking.scheduledAt).toLocaleString()}</p>
      <p>Estimate: ₹${booking.priceEstimate} ${booking.paymentStatus ? `• ${booking.paymentStatus}` : ''}</p>
      <button class="secondary" onclick="pay('${booking.id}', ${booking.priceEstimate})">Pay test amount</button>
    </article>`).join('') || '<p class="empty-state">No bookings yet. Create one on this page.</p>';
  out(data);
}

async function pay(bookingId, amount) {
  const data = await api('/api/payments', { method: 'POST', body: JSON.stringify({ bookingId, amount }) });
  out(data);
  await refreshBookings();
}
window.pay = pay;

async function refreshReviews() {
  const container = $('#reviews');
  if (!container) return;
  const data = await api('/api/reviews');
  container.innerHTML = data.reviews.map((review) => {
    const provider = providers.find((item) => item.id === review.providerId);
    return `<article class="booking">
      <strong>${provider ? provider.name : review.providerId}</strong>
      <p>${review.comment}</p>
      <span class="badge">Rating ${review.rating}/5</span>
      <span class="badge">${review.status}</span>
    </article>`;
  }).join('') || '<p class="empty-state">No reviews yet.</p>';
  out(data);
}

async function loadAdminDashboard() {
  const [summary, providerData] = await Promise.all([api('/api/admin/summary'), api('/api/providers')]);
  const stats = $('#adminStats');
  const adminProviders = $('#adminProviders');
  if (stats) stats.innerHTML = Object.entries(summary).map(([key, value]) => `<article class="stat"><span>${key}</span><strong>${value}</strong></article>`).join('');
  if (adminProviders) {
    adminProviders.innerHTML = providerData.providers.map((provider) => `
      <article class="provider admin-provider">
        <div>
          <h3>${provider.name}</h3>
          <p class="muted">${provider.category} • ${provider.location} • Verified: ${provider.verified}</p>
        </div>
        <button class="secondary" onclick="verifyProvider('${provider.id}', ${!provider.verified})">${provider.verified ? 'Unverify' : 'Verify'}</button>
      </article>`).join('');
  }
  out({ summary, providers: providerData.providers });
}

async function verifyProvider(providerId, verified) {
  const data = await api(`/api/providers/${providerId}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) });
  out(data);
  await loadAdminDashboard();
}
window.verifyProvider = verifyProvider;

function setupForms() {
  $('#loginBtn')?.addEventListener('click', async () => {
    try {
      const form = Object.fromEntries(new FormData($('#authForm')));
      const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
      setSession(data.user, data.token);
      out(data);
      goToNextPageFor(data.user);
    } catch (err) { out(`Login failed: ${err.message}`); }
  });

  $('#registerBtn')?.addEventListener('click', async () => {
    try {
      const form = Object.fromEntries(new FormData($('#authForm')));
      const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
      setSession(data.user, data.token);
      out(data);
      goToNextPageFor(data.user);
    } catch (err) { out(`Registration failed: ${err.message}`); }
  });

  $('#searchForm')?.addEventListener('submit', searchProviders);
  $('#refreshBookings')?.addEventListener('click', () => refreshBookings().catch((err) => out(`Booking refresh failed: ${err.message}`)));
  $('#refreshReviews')?.addEventListener('click', () => refreshReviews().catch((err) => out(`Review refresh failed: ${err.message}`)));
  $('#loadAdmin')?.addEventListener('click', () => loadAdminDashboard().catch((err) => out(`Admin load failed: ${err.message}. Login as admin@smartlocal.test first.`)));

  $('#bookingForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const form = Object.fromEntries(new FormData(event.target));
      form.emergency = Boolean(form.emergency);
      form.scheduledAt = new Date(form.scheduledAt).toISOString();
      const data = await api('/api/bookings', { method: 'POST', body: JSON.stringify(form) });
      out(data);
      await refreshBookings();
    } catch (err) { out(`Booking failed: ${err.message}`); }
  });

  $('#reviewForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const form = Object.fromEntries(new FormData(event.target));
      form.rating = Number(form.rating);
      const data = await api('/api/reviews', { method: 'POST', body: JSON.stringify(form) });
      out(data);
      await refreshReviews();
    } catch (err) { out(`Review failed: ${err.message}`); }
  });

  $('#mlForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const form = Object.fromEntries(new FormData(event.target));
      const data = await api('/api/ml/detect-review', { method: 'POST', body: JSON.stringify(form) });
      $('#mlResult').innerHTML = `<p><strong>${data.isSuspicious ? 'Suspicious' : 'Looks authentic'}</strong> (${Math.round(data.confidence * 100)}% confidence)</p><p class="muted">${data.reason}</p>`;
      out(data);
    } catch (err) { out(`ML check failed: ${err.message}`); }
  });
}

async function initPage() {
  updateSessionLabel();
  setupNavigation();
  setupForms();

  try {
    const scheduledAt = document.querySelector('[name="scheduledAt"]');
    if (scheduledAt) {
      const tomorrow = new Date(Date.now() + 86400000);
      tomorrow.setMinutes(0, 0, 0);
      scheduledAt.value = tomorrow.toISOString().slice(0, 16);
    }

    await loadCategories();
    await loadProviderOptions();

    if ($('#providers')) await searchProviders();
    if ($('#bookings') && token) await refreshBookings();
    if ($('#reviews')) await refreshReviews();
  } catch (err) {
    out(`Backend is not reachable yet (${err.message}). Start it with: cd backend && npm start`);
  }
}

initPage();
