/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const update_project = async (id, project_data) => {
    let text = ' UPDATE projects ';

    if (project_data) {
        text += ' SET ';
    }
    const values = [];
    if (Object.prototype.hasOwnProperty.call(project_data, 'name')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.name);
        text += `name=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'owner_id')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.owner_id);
        text += `owner_id=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.start_date);
        text += `start_date=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.scheduled_end);
        text += `scheduled_end=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'address')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.address);
        text += `address=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'area')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.area);
        text += `area=$${values.length}`;
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'is_multizoned')) {
        text += values.length === 0 ? '' : ', ';
        values.push(project_data.is_multizoned);
        text += `is_multizoned=$${values.length}`;
    }
    values.push(id);
    text += ` WHERE id=$${values.length} `;
    console.log(text, values);
    const res = await db.insertOrUpdate({ text, values });
    return res.rows[0];
};

module.exports = {
    fetch_project,
    update_project,
};
