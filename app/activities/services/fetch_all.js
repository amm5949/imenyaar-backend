/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_activities_page_count = async (activity_data) => {
    const size = activity_data.size || 10;
    let text = `
        SELECT COUNT(*) AS count
        FROM activities
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date')) {
        values.push(activity_data.start_date);
        wheres.push(`start_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date')) {
        values.push(activity_data.scheduled_end_date);
        wheres.push(`scheduled_end_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'person_id')) {
        values.push(activity_data.person_id);
        wheres.push(`person_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'status')) {
        values.push(activity_data.status);
        wheres.push(`status=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'is_done')) {
        values.push(activity_data.is_done);
        wheres.push(`is_done=$${values.length}`);
    }


    text += wheres.join(' AND ');
    const pages = await db.executeQuery({
        text,
        values,
    });
    return Math.ceil(pages.rows[0].count / size);
};

const fetch_activities = async (activity_data) => {
    const page = activity_data.page || 1;
    const size = activity_data.size || 10;
    let text = `
        SELECT id, start_date, scheduled_end_date, person_id, status, is_done
        FROM activities
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date')) {
        values.push(activity_data.start_date);
        wheres.push(`start_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date')) {
        values.push(activity_data.scheduled_end_date);
        wheres.push(`scheduled_end_date=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'person_id')) {
        values.push(activity_data.person_id);
        wheres.push(`person_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'status')) {
        values.push(activity_data.status);
        wheres.push(`status=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'is_done')) {
        values.push(activity_data.is_done);
        wheres.push(`is_done=$${values.length}`);
    }

    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` OFFSET ${offset} LIMIT ${limit}`;
    const res = await db.executeQuery({
        text,
        values,
    });
    const page_count = await fetch_activities_page_count(activity_data);
    const ret_val = {
        values: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_activities,
};
