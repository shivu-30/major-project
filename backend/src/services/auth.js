const crypto = require('crypto');

const secret = process.env.JWT_SECRET || 'development-secret-change-me';

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function signToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, email: user.email })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const actualBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch (_err) {
    return null;
  }
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { hashPassword, signToken, verifyToken, publicUser };
