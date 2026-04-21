const BASIC_AUTH_USER = process.env.DASHBOARD_BASIC_AUTH_USER || '';
const BASIC_AUTH_PASS = process.env.DASHBOARD_BASIC_AUTH_PASS || '';

function sendJsonError(res, fileName, error) {
  const statusCode = error && error.code === 'ENOENT' ? 404 : 500;
  res.status(statusCode).json({
    ok: false,
    error: statusCode === 404 ? 'not_found' : 'read_failed',
    file: fileName,
  });
}

function authEnabled() {
  return Boolean(BASIC_AUTH_USER && BASIC_AUTH_PASS);
}

function unauthorized(res) {
  res.setHeader('WWW-Authenticate', 'Basic realm="Mission Control"');
  res.status(401).json({ ok: false, error: 'auth_required' });
}

function hasValidBasicAuth(req) {
  if (!authEnabled()) return true;

  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;

  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return false;
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    return user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS;
  } catch {
    return false;
  }
}

function withBasicAuth(handler) {
  return async function guardedHandler(req, res) {
    if (!hasValidBasicAuth(req)) {
      return unauthorized(res);
    }
    return handler(req, res);
  };
}

function createDataHandler(fileName, loadData) {
  return withBasicAuth(async function handler(_req, res) {
    try {
      const data = loadData();
      res.status(200).json(data);
    } catch (error) {
      sendJsonError(res, fileName, error);
    }
  });
}

module.exports = {
  sendJsonError,
  createDataHandler,
  withBasicAuth,
};
