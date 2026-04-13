const { createDataHandler } = require('./_lib');
module.exports = createDataHandler('projects.json', () => require('../projects.json'));
