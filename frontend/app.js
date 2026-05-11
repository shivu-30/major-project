const API = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let token = localStorage.getItem('token') || '';
let currentUser = null;
let authMode = 'login';
let providers = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const page = document.body.dataset.page || 'home';

function setStatus(message, type = 'info') {
  const status = $('#statusMessage');
  if (status) {
    status.textContent = message;
    status.dataset.type = type;
  }
  const output = $('#output');
  if (output) output.textContent = message;
}

function showWorkflow(isSignedIn) {
  $('#loginView')?.classList.toggle('hidden', isSignedIn);
  $('#dashboardView')?.classList.toggle('hidden', !isSignedIn);
}

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

  if ($('#sessionLabel')) $('#sessionLabel').textContent = user ? `${user.name} (${user.role})` : 'Guest';
  if ($('#authStatus')) {
    $('#authStatus').textContent = user ? 'Signed in' : 'Signed out';
    $('#authStatus').classList.toggle('success', Boolean(user));
  }
  $('#logoutBtn')?.classList.toggle('hidden', !user);
  if ($('#dashboardIntro')) $('#dashboardIntro').textContent = user ? `Welcome, ${user.name}. Pick a provider, schedule a booking, pay, and review from here.` : 'Your logged-in workflow is ready.';
  showWorkflow(Boolean(user));
  setFeatureAccess(Boolean(user));
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  $('#loginTab')?.classList.toggle('active', !isRegister);
  $('#registerTab')?.classList.toggle('active', isRegister);
  $('#loginTab')?.setAttribute('aria-selected', String(!isRegister));
  $('#registerTab')?.setAttribute('aria-selected', String(isRegister));
  $$('.register-only').forEach((item) => item.classList.toggle('hidden', !isRegister));
  if ($('#authSubmit')) $('#authSubmit').textContent = isRegister ? 'Create account' : 'Login';
  if ($('#passwordInput')) $('#passwordInput').autocomplete = isRegister ? 'new-password' : 'current-password';
  if ($('#nameInput')) $('#nameInput').required = isRegister;
}

function validateAuthForm(form) {
  const email = String(form.email || '').trim();
  const password = String(form.password || '');
  if (!email.includes('@')) return 'Please enter a valid email address.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (authMode === 'register' && !String(form.name || '').trim()) return 'Please enter your full name to register.';
  return '';
}

async function authenticate(mode = authMode) {
  const authForm = $('#authForm');
  if (!authForm) return;
  const form = Object.fromEntries(new FormData(authForm));
  const validationError = validateAuthForm(form);
  if (validationError) {
    setStatus(validationError, 'error');
    return;
  }

  const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
  const data = await api(path, { method: 'POST', body: JSON.stringify(form) });
  updateSession(data.user, data.token);
  if ($('#searchForm')) await searchProviders();
  if ($('#bookingForm')) await refreshBookings({ silent: true });
  if ($('#reviewForm')) await refreshReviews({ silent: true });
  setStatus(`Signed in as ${data.user.name}. Workflow is ready.`, 'success');
  $('#dashboardView')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  if (!$('#categorySelect')) return;
  const data = await api('/api/categories');
  const options = data.categories.map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
  $('#categorySelect').insertAdjacentHTML('beforeend', options);
}

async function loadProviders() {
  const data = await api('/api/providers');
  renderProviders(data.providers || [], { preserveCards: page !== 'home' && page !== 'search' });
  return data.providers || [];
}

function chooseProvider(providerId) {
  if ($('#providerSelect')) $('#providerSelect').value = providerId;
  if ($('#reviewProviderSelect')) $('#reviewProviderSelect').value = providerId;
  const provider = providers.find((item) => item.id === providerId);
  if (provider?.services?.[0] && $('#serviceInput')) $('#serviceInput').value = provider.services[0];
  setStatus(`${provider?.name || 'Provider'} selected. Complete booking and payment before submitting a review.`, 'success');
  ($('#bookingForm') || $('#reviewForm'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.chooseProvider = chooseProvider;

function renderProviders(items, options = {}) {
  providers = items;
  if ($('#providerCount')) $('#providerCount').textContent = `${items.length} provider${items.length === 1 ? '' : 's'}`;
  const providerOptions = items.map((provider) => `<option value="${provider.id}">${provider.name}</option>`).join('');
  if ($('#providerSelect')) $('#providerSelect').innerHTML = providerOptions;
  if ($('#reviewProviderSelect')) $('#reviewProviderSelect').innerHTML = providerOptions;
  if (!$('#providers') || options.preserveCards) return;
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
      <button type="button" class="secondary select-provider" onclick="chooseProvider('${provider.id}')">Select and schedule</button>
    </article>`).join('') || '<p>No providers found. Try another category or location.</p>';
}

async function searchProviders(event) {
  event?.preventDefault();
  if (!$('#searchForm')) return loadProviders();
  const form = new FormData($('#searchForm'));
  const params = new URLSearchParams();
  for (const [key, value] of form.entries()) if (value && value !== 'on') params.set(key, value);
  if (form.get('emergency')) params.set('emergency', 'true');
  const data = await api(`/api/recommendations?${params}`);
  renderProviders(data.providers || []);
  setStatus(`${data.providers.length} provider${data.providers.length === 1 ? '' : 's'} ready to choose.`, 'success');
}

async function refreshBookings(options = {}) {
  if (!token || !$('#bookings')) return;
  const data = await api('/api/bookings');
  $('#bookings').innerHTML = data.bookings.map((booking) => `
    <article class="booking">
      <strong>${booking.service}</strong>
      <p class="muted">${booking.status} • ${new Date(booking.scheduledAt).toLocaleString()}</p>
      <p>Estimate: ₹${booking.priceEstimate} ${booking.paymentStatus === 'paid' ? '• Paid' : ''}</p>
      <button class="secondary" onclick="pay('${booking.id}', ${booking.priceEstimate})" ${booking.paymentStatus === 'paid' ? 'disabled' : ''}>Pay test amount</button>
    </article>`).join('') || '<p>No bookings yet.</p>';
  if (!options.silent) setStatus(`${data.bookings.length} booking${data.bookings.length === 1 ? '' : 's'} loaded.`, 'success');
}

async function pay(bookingId, amount) {
  await api('/api/payments', { method: 'POST', body: JSON.stringify({ bookingId, amount }) });
  await refreshBookings({ silent: true });
  setStatus('Payment captured successfully. You can now submit one review for that provider.', 'success');
}
window.pay = pay;

function reviewStatusBadge(status) {
  const labels = { published: 'Published', flagged: 'Flagged for admin review', rejected: 'Rejected' };
  const classes = { published: 'badge', flagged: 'badge urgent', rejected: 'badge neutral' };
  return `<span class="${classes[status] || 'badge neutral'}">${labels[status] || status}</span>`;
}

async function refreshReviews(options = {}) {
  if (!$('#reviews')) return;
  const data = await api('/api/reviews');
  $('#reviews').innerHTML = data.reviews.map((review) => `
    <article class="review-card">
      <div class="provider-title">
        <strong>${review.providerName}</strong>
        ${reviewStatusBadge(review.status)}
      </div>
      <p>⭐ ${review.rating}/5 — ${review.comment}</p>
      <p class="muted">${review.moderation?.reason || 'No moderation details.'} Confidence: ${Math.round((review.moderation?.confidence || 0) * 100)}%.</p>
      <small>${new Date(review.createdAt).toLocaleString()}</small>
    </article>`).join('') || '<p>No reviews yet. Book, pay, and submit the first review.</p>';
  if (!options.silent) setStatus(`${data.reviews.length} review${data.reviews.length === 1 ? '' : 's'} loaded.`, 'success');
}

async function loadAdminDashboard() {
  const summary = await api('/api/admin/summary');
  if ($('#adminStats')) {
    $('#adminStats').innerHTML = Object.entries(summary).map(([key, value]) => `<article><strong>${value}</strong><span>${key}</span></article>`).join('');
  }
  setStatus('Admin dashboard loaded.', 'success');
}

function wireEvents() {
  $('#authForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try { await authenticate(); } catch (err) { setStatus(err.message, 'error'); }
  });
  $('#loginBtn')?.addEventListener('click', async () => { try { await authenticate('login'); } catch (err) { setStatus(err.message, 'error'); } });
  $('#registerBtn')?.addEventListener('click', async () => { try { await authenticate('register'); } catch (err) { setStatus(err.message, 'error'); } });
  $('#loginTab')?.addEventListener('click', () => setAuthMode('login'));
  $('#registerTab')?.addEventListener('click', () => setAuthMode('register'));
  $('#logoutBtn')?.addEventListener('click', () => {
    updateSession(null, '');
    if ($('#bookings')) $('#bookings').innerHTML = '';
    setStatus('Signed out. Login again to book, pay, and review providers.');
  });
  $('#togglePassword')?.addEventListener('click', () => {
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
      try { await authenticate(); } catch (err) { setStatus(err.message, 'error'); }
    });
  });
  $('#searchForm')?.addEventListener('submit', searchProviders);
  $('#refreshBookings')?.addEventListener('click', () => refreshBookings());
  $('#refreshReviews')?.addEventListener('click', () => refreshReviews());
  $('#loadAdmin')?.addEventListener('click', async () => { try { await loadAdminDashboard(); } catch (err) { setStatus(err.message, 'error'); } });
  $$('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => $(`#${button.dataset.scrollTarget}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
  $('#bookingForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const form = Object.fromEntries(new FormData(event.target));
      form.emergency = Boolean(form.emergency);
      form.scheduledAt = new Date(form.scheduledAt).toISOString();
      const data = await api('/api/bookings', { method: 'POST', body: JSON.stringify(form) });
      setStatus(`Booking created for ${new Date(data.booking.scheduledAt).toLocaleString()}. Pay it before reviewing.`, 'success');
      await refreshBookings();
    } catch (err) { setStatus(err.message, 'error'); }
  });
  $('#reviewForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const form = Object.fromEntries(new FormData(event.target));
      form.rating = Number(form.rating);
      const data = await api('/api/reviews', { method: 'POST', body: JSON.stringify(form) });
      setStatus(`Review ${data.review.status}. ${data.review.moderation.reason}`, 'success');
      await refreshReviews({ silent: true });
      if ($('#searchForm')) await searchProviders();
      else await loadProviders();
    } catch (err) { setStatus(err.message, 'error'); }
  });
}

(async function init() {
  try {
    wireEvents();
    const scheduledAt = document.querySelector('[name="scheduledAt"]');
    if (scheduledAt) {
      const tomorrow = new Date(Date.now() + 86400000);
      tomorrow.setMinutes(0, 0, 0);
      scheduledAt.value = tomorrow.toISOString().slice(0, 16);
    }
    setAuthMode('login');
    await restoreSession();
    await loadCategories();
    await loadProviders();
    if ($('#searchForm')) await searchProviders();
    if (token) {
      await refreshBookings({ silent: true });
      await refreshReviews({ silent: true });
    } else if ($('#reviewForm')) {
      setStatus('Login on the home page first, then return here to submit reviews after payment.');
      await refreshReviews({ silent: true });
    } else {
      setStatus('Login with a demo account or register to use all features.');
    }
  } catch (err) {
    setStatus(`Backend is not reachable yet (${err.message}). Start it with: cd backend && npm install && npm start`, 'error');
  }
})();
