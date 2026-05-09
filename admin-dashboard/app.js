const API = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let token = localStorage.getItem('adminToken') || '';
const $ = (selector) => document.querySelector(selector);
const out = (data) => { $('#output').textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2); };

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function renderStats(summary) {
  $('#stats').innerHTML = Object.entries(summary).map(([key, value]) => `<article class="stat"><span>${key}</span><strong>${value}</strong></article>`).join('');
}

async function loadDashboard() {
  const [summary, providers] = await Promise.all([api('/api/admin/summary'), api('/api/providers')]);
  renderStats(summary);
  $('#providers').innerHTML = providers.providers.map((provider) => `
    <div class="provider">
      <span><strong>${provider.name}</strong><br>${provider.category} • ${provider.location} • Verified: ${provider.verified}</span>
      <button onclick="verifyProvider('${provider.id}', ${!provider.verified})">${provider.verified ? 'Unverify' : 'Verify'}</button>
    </div>`).join('');
  out({ summary, providers });
}

async function verifyProvider(id, verified) {
  const data = await api(`/api/providers/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) });
  out(data);
  await loadDashboard();
}
window.verifyProvider = verifyProvider;

$('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) });
  token = data.token;
  localStorage.setItem('adminToken', token);
  await loadDashboard();
});

if (token) loadDashboard().catch((err) => out(err.message));
