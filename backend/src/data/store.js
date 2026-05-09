const fs = require('fs');
const path = require('path');
const seed = require('./seed');

const defaultDataFile = path.join(__dirname, 'app-data.json');
const dataFile = path.resolve(process.env.DATA_FILE || defaultDataFile);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureStore() {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2));
}

function read() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function write(data) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  return data;
}

function reset() {
  write(clone(seed));
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = { read, write, reset, id };
