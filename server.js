const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');

const dataFiles = {
  status: 'status.json',
  watchdog: 'watchdog.json',
  tasks: 'tasks.json',
  'cron-jobs': 'cron-jobs.json',
  memory: 'memory.json',
  projects: 'projects.json'
};

app.disable('x-powered-by');

app.get('/', (_req, res) => {
  res.sendFile(INDEX_FILE);
});

app.get('/index.html', (_req, res) => {
  res.sendFile(INDEX_FILE);
});

async function readJsonFile(fileName) {
  const filePath = path.join(ROOT_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function sendJsonError(res, fileName, error) {
  const statusCode = error.code === 'ENOENT' ? 404 : 500;
  res.status(statusCode).json({
    ok: false,
    error: statusCode === 404 ? 'not_found' : 'read_failed',
    file: fileName
  });
}

for (const [routeName, fileName] of Object.entries(dataFiles)) {
  app.get(`/api/${routeName}`, async (_req, res) => {
    try {
      const data = await readJsonFile(fileName);
      res.json(data);
    } catch (error) {
      sendJsonError(res, fileName, error);
    }
  });
}

app.get('/api/health', async (_req, res) => {
  const files = {};

  await Promise.all(
    Object.values(dataFiles).map(async (fileName) => {
      try {
        await fs.access(path.join(ROOT_DIR, fileName));
        files[fileName] = true;
      } catch {
        files[fileName] = false;
      }
    })
  );

  const ok = Object.values(files).every(Boolean);

  res.json({
    ok,
    generatedAt: new Date().toISOString(),
    files
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'not_found'
  });
});

app.listen(PORT, () => {
  console.log(`Mission Control listening on http://localhost:${PORT}`);
});
