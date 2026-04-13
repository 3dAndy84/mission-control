const fs = require('fs/promises');
const path = require('path');
const { ROOT_DIR } = require('./_lib');

const dataFiles = [
  'status.json',
  'watchdog.json',
  'tasks.json',
  'cron-jobs.json',
  'memory.json',
  'projects.json',
];

module.exports = async function handler(_req, res) {
  const files = {};

  await Promise.all(
    dataFiles.map(async (fileName) => {
      try {
        await fs.access(path.join(ROOT_DIR, fileName));
        files[fileName] = true;
      } catch {
        files[fileName] = false;
      }
    })
  );

  res.status(200).json({
    ok: Object.values(files).every(Boolean),
    generatedAt: new Date().toISOString(),
    files,
  });
};
