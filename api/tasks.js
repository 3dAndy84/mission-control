const { createDataHandler } = require('./_lib');
module.exports = createDataHandler('tasks.json', () => require('../tasks.json'));
