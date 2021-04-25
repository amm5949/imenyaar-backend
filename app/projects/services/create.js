/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


module.exports = async (project_details) => {
    const insertData = {
        ...project_details,
        is_deleted: false,
    };

    const record = await db.insertQuery('projects', insertData);
    return record;
};
