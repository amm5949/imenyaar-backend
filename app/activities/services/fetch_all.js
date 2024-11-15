/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_activities_page_count = async (activity_data, user) => {
    const size = activity_data.size || 10;
    let text = `
        SELECT count(a.*)
        FROM activities a
        INNER JOIN projects pp ON pp.id = a.project_id 
        WHERE
    `;
    const temp = [user.id];
    const values = [];
    const wheres = ['a.is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(activity_data, 'name')) {
        values.push(activity_data.zones);
        wheres.push(`a.name LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'zones')) {
        values.push(activity_data.zones);
        wheres.push(`$${values.length} = ANY(zones)`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'people')) {
        values.push(activity_data.people);
        wheres.push(`$${values.length} = ANY(people)`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date_from')) {
        values.push(activity_data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date_from')) {
        values.push(activity_data.scheduled_end_date_from);
        wheres.push(`scheduled_end_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date_to')) {
        values.push(activity_data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date_to')) {
        values.push(activity_data.scheduled_end_date_to);
        wheres.push(`scheduled_end_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'status')) {
        values.push(activity_data.status);
        wheres.push(`status=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'is_done')) {
        values.push(activity_data.is_done);
        wheres.push(`is_done=$${values.length}`);
    }

    values.push(user.id);
    wheres.push(`(pp.owner_id = $${values.length} 
        OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) 
        OR $${values.length} = ANY(people))`);

    text += wheres.join(' AND ');
    const pages = await db.executeQuery({
        text,
        values,
    });
    return Math.ceil(pages.rows[0].count / size);
};

const fetch_activities = async (activity_data, user) => {
    const page = activity_data.page || 1;
    const size = activity_data.size || 10;
    let text = `
        SELECT a.*
        FROM activities a
        INNER JOIN projects pp ON pp.id = a.project_id 
        WHERE
    `;
    const temp = [user.id];
    const values = [];
    const wheres = ['a.is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(activity_data, 'name')) {
        values.push(activity_data.zones);
        wheres.push(`a.name LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'zones')) {
        values.push(activity_data.zones);
        wheres.push(`$${values.length} = ANY(zones)`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'people')) {
        values.push(activity_data.people);
        wheres.push(`$${values.length} = ANY(people)`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date_from')) {
        values.push(activity_data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date_from')) {
        values.push(activity_data.scheduled_end_date_from);
        wheres.push(`scheduled_end_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'start_date_to')) {
        values.push(activity_data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'scheduled_end_date_to')) {
        values.push(activity_data.scheduled_end_date_to);
        wheres.push(`scheduled_end_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'status')) {
        values.push(activity_data.status);
        wheres.push(`status=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(activity_data, 'is_done')) {
        values.push(activity_data.is_done);
        wheres.push(`is_done=$${values.length}`);
    }

    values.push(user.id);
    wheres.push(`(pp.owner_id = $${values.length} 
        OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) 
        OR $${values.length} = ANY(people))`);

    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` OFFSET ${offset} LIMIT ${limit}`;
    const res = await db.executeQuery({
        text,
        values,
    });
    const page_count = await fetch_activities_page_count(activity_data, user);
    const ret_val = {
        values: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_activities,
};
