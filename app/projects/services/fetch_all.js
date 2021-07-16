/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const check_user_role = async (user) => {
    const res = await db.fetch({
        text: `SELECT role_id as i
               FROM user_roles
               WHERE is_deleted = FALSE
               AND user_id = $1`,
        values: [user.id],
    });
    if (res === undefined) {
        return false;
    }
    return res.i === 1;
};

const fetch_projects_page_count = async (project_data, user) => {
    const size = project_data.size || 10;
    let text = `
        SELECT COUNT(*) AS count
        FROM projects p
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (!(await check_user_role(user))) {
        values.push(user.id);
        wheres.push(`(p.owner_id=$${values.length} OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) OR $${values.length} in (SELECT user_id FROM project_people pp WHERE pp.project_id=p.id and is_deleted=false))`);
    }

    if (Object.prototype.hasOwnProperty.call(project_data, 'name')) {
        values.push(project_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'owner_id')) {
        values.push(project_data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date_from')) {
        values.push(project_data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end_date_from')) {
        values.push(project_data.scheduled_end_date_from);
        wheres.push(`scheduled_end>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date_to')) {
        values.push(project_data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end_date_to')) {
        values.push(project_data.scheduled_end_date_to);
        wheres.push(`scheduled_end<=$${values.length}`);
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

const fetch_projects = async (project_data, user) => {
    const page = project_data.page || 1;
    const size = project_data.size || 10;
    let text = `
        SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
        FROM projects p
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (!(await check_user_role(user))) {
        values.push(user.id);
        wheres.push(`(p.owner_id=$${values.length} OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) OR $${values.length} in (SELECT user_id FROM project_people pp WHERE pp.project_id=p.id and is_deleted=false))`);
    }

    if (Object.prototype.hasOwnProperty.call(project_data, 'name')) {
        values.push(project_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'owner_id')) {
        values.push(project_data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date_from')) {
        values.push(project_data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end_date_from')) {
        values.push(project_data.scheduled_end_date_from);
        wheres.push(`scheduled_end>=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'start_date_to')) {
        values.push(project_data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(project_data, 'scheduled_end_date_to')) {
        values.push(project_data.scheduled_end_date_to);
        wheres.push(`scheduled_end<=$${values.length}`);
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
    const page_count = await fetch_projects_page_count(project_data, user);
    const ret_val = {
        values: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_projects,
};
