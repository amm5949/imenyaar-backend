/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');
/* eslint-disable*/
const test_users = async (users) => {
    const people = [];
    for (const user of users) {
        const res = await db.fetch({
            text: `SELECT user_id as i
                   FROM project_people
                   WHERE is_deleted = FALSE
                   AND user_id = $1`,
            values: [user],
        });
        if (res) {
            people.push(res.i);
        }
    }
    return people;
};

const test_zones = async (_zones) => {
    const zones = [];
    for (const id of _zones) {
        const res = await db.fetch({
            text: `SELECT id as i
                   FROM zones
                   WHERE is_deleted = false AND id = $1`,
            values: [id],
        });

        if (res) {
            zones.push(res.i);
        }
    }
    return zones;
};


const create = async (activity_details) => {
    const insertData = {
        ...activity_details,
        is_deleted: false,
        is_done: false,
    };

    const record = await db.insertQuery('activities', insertData);
    return record;
};

module.exports = {
    test_users,
    test_zones,
    create,
};
