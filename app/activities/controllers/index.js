/* eslint-disable camelcase */
const create = require('./create');
const fetch = require('./fetch');
const list = require('./fetch_all');
const update = require('./update');
const remove = require('./remove');
const add_people = require('./expires');

module.exports = {
    create,
    fetch,
    list,
    update,
    remove,
    add_people,
};
