/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


module.exports = async (activity_details) => {
    const insertData = {
        ...activity_details,
        is_deleted: false,
        is_done: false,
    };

    const record = await db.insertQuery('activities', insertData);
    return record;
};
