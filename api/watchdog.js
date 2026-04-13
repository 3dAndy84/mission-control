const { createDataHandler } = require('./_lib');
module.exports = createDataHandler('watchdog.json', () => require('../watchdog.json'));
