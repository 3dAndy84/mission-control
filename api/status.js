const { createDataHandler } = require('./_lib');
module.exports = createDataHandler('status.json', () => require('../status.json'));
