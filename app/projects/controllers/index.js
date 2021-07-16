/* eslint-disable camelcase */
const create = require('./create');
const fetch = require('./fetch');
const list = require('./fetch_all');
const update = require('./update');
const remove = require('./remove');
const add_people = require('./add_people');
const fetch_people = require('./fetch_project_people.js');
const remove_people = require('./delete_people.js');
module.exports = {
    create,
    fetch,
    list,
    update,
    remove,
    add_people,
    fetch_people,
    remove_people,
};
