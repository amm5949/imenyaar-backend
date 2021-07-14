/* eslint-disable camelcase */
const create = require('./create');
const update = require('./update');
const fetch = require('./fetch');
const list = require('./list');
const files = require('./files');

module.exports = {
    create,
    fetch,
    list,
    files,
    update,
};
