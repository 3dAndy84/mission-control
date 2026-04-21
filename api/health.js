const { withBasicAuth } = require('./_lib');

const loaders = {
  'status.json': () => require('../status.json'),
  'watchdog.json': () => require('../watchdog.json'),
  'tasks.json': () => require('../tasks.json'),
  'cron-jobs.json': () => require('../cron-jobs.json'),
  'memory.json': () => require('../memory.json'),
  'projects.json': () => require('../projects.json'),
};

module.exports = withBasicAuth(async function handler(_req, res) {
  const files = Object.fromEntries(
    Object.entries(loaders).map(([fileName, load]) => {
      try {
        load();
        return [fileName, true];
      } catch {
        return [fileName, false];
      }
    })
  );

  res.status(200).json({
    ok: Object.values(files).every(Boolean),
    generatedAt: new Date().toISOString(),
    files,
  });
});
