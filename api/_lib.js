const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

async function readJson(fileName) {
  const raw = await fs.readFile(path.join(ROOT_DIR, fileName), 'utf8');
  return JSON.parse(raw);
}

function sendJsonError(res, fileName, error) {
  const statusCode = error && error.code === 'ENOENT' ? 404 : 500;
  res.status(statusCode).json({
    ok: false,
    error: statusCode === 404 ? 'not_found' : 'read_failed',
    file: fileName,
  });
}

function createDataHandler(fileName) {
  return async function handler(_req, res) {
    try {
      const data = await readJson(fileName);
      res.status(200).json(data);
    } catch (error) {
      sendJsonError(res, fileName, error);
    }
  };
}

module.exports = {
  ROOT_DIR,
  readJson,
  sendJsonError,
  createDataHandler,
};
