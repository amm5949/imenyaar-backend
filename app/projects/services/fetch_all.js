/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_projects_page_count = async (project_data) => {
    const size = project_data.size || 10;
    let text = `
        SELECT COUNT(*) AS count
        FROM projects
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(project_data, 'name')) {
        values.push(project_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'owner_id')) {
        values.push(project_data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date')) {
        values.push(project_data.start_date);
        wheres.push(`start_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end')) {
        values.push(project_data.scheduled_end);
        wheres.push(`scheduled_end=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'address')) {
        values.push(project_data.address);
        wheres.push(`address=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'area')) {
        values.push(project_data.area);
        wheres.push(`area=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'is_multizoned')) {
        values.push(project_data.is_multizoned);
        wheres.push(`is_multizoned=$${values.length}`);
    }

    text += wheres.join(' AND ');
    const pages = await db.executeQuery({
        text,
        values,
    });
    return Math.ceil(pages.rows[0].count / size);
};
const fetch_projects = async (project_data) => {
    const page = project_data.page || 1;
    const size = project_data.size || 10;
    let text = `
        SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
        FROM projects
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(project_data, 'name')) {
        values.push(project_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'owner_id')) {
        values.push(project_data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date')) {
        values.push(project_data.start_date);
        wheres.push(`start_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end')) {
        values.push(project_data.scheduled_end);
        wheres.push(`scheduled_end=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'address')) {
        values.push(project_data.address);
        wheres.push(`address=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'area')) {
        values.push(project_data.area);
        wheres.push(`area=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'is_multizoned')) {
        values.push(project_data.is_multizoned);
        wheres.push(`is_multizoned=$${values.length}`);
    }


    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` OFFSET ${offset} LIMIT ${limit}`;
    const res = await db.executeQuery({
        text,
        values,
    });
    const page_count = await fetch_projects_page_count(project_data);
    const ret_val = {
        values: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_projects,
};
