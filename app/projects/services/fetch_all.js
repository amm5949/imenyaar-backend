/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');
const fetchService = require('./fetch');

const check_user_role = async (user) => {
    const res = await db.fetch({
        text: `SELECT role_id
               FROM user_roles
               WHERE user_id = $1`,
        values: [user.id],
    });
    if (res === undefined) {
        return false;
    }
    return res.role_id == 1;
};

const count = async (data, user) => {
    let text = `
        SELECT COUNT(*) AS count
        FROM (SELECT p.* 
            FROM projects p
            inner join zones z on z.project_id = p.id
            left join reports r on r.zone_id = z.id
            left join incidents i on i.zone_id = z.id
            WHERE
    `;
    const values = [];
    const wheres = ['p.is_deleted = false'];

    if (!(await check_user_role(user))) {
        values.push(user.id);
        wheres.push(`(p.owner_id=$${values.length} 
            OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) 
            OR $${values.length} in (SELECT user_id FROM project_people pp WHERE pp.project_id=p.id and pp.is_deleted=false))`);
    }
    if(data.hasOwnProperty('filter')) {
        values.push(data.filter);
        wheres.push(`
            (p.name LIKE $${values.length}
            OR address LIKE $${values.length})
        `);
    }

    if (data.hasOwnProperty('owner_id')) {
        values.push(data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (data.hasOwnProperty('start_date_from')) {
        values.push(data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (data.hasOwnProperty('scheduled_end_date_from')) {
        values.push(data.scheduled_end_date_from);
        wheres.push(`scheduled_end>=$${values.length}`);
    }
    if (data.hasOwnProperty('start_date_to')) {
        values.push(data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (data.hasOwnProperty('scheduled_end_date_to')) {
        values.push(data.scheduled_end_date_to);
        wheres.push(`scheduled_end<=$${values.length}`);
    }
    if (data.hasOwnProperty('is_multizoned')) {
        values.push(data.is_multizoned);
        wheres.push(`is_multizoned=$${values.length}`);
    }
    if(data.hasOwnProperty('check_active') && data.check_active === true){
        const date = {};
        date.now = new Date();
        date.lastWeek = new Date();
        date.lastWeek.setDate(date.lastWeek.getDate() - 7);
        values.push(date.lastWeek);
        values.push(date.now);
        wheres.push(`
            ((i.date >= $${values.length-1} AND i.date <= $${values.length})
            OR
            (r.creation_date >= $${values.length-1} AND r.creation_date <= $${values.length}))
        `);
    }

    text += wheres.join(' AND ');
    text += ` GROUP BY p.id) AS temp`
    const count = (await db.fetch({
        text,
        values,
    })).count;
    return count;
};


const fetch_projects = async (data, user) => {
    const page = data.page || 1;
    const size = data.size || 10;
    let text = `
        SELECT p.id, p.name, p.owner_id, u.first_name, u.last_name,
             start_date, scheduled_end, address, area, is_multizoned
        FROM projects p
        inner join users u on u.id = owner_id
        inner join zones z on z.project_id = p.id
        left join reports r on r.zone_id = z.id
        left join incidents i on i.zone_id = z.id
        WHERE
    `;
    const values = [];
    const wheres = ['p.is_deleted = false'];
    if (!(await check_user_role(user))) {
        values.push(user.id);
        wheres.push(`(p.owner_id=$${values.length} OR $${values.length} in (select user_id from user_roles u WHERE u.role_id = 1) 
        OR $${values.length} in (SELECT user_id FROM project_people pp WHERE pp.project_id=p.id))`);
    }

    if(data.hasOwnProperty('filter')) {
        values.push(data.filter);
        wheres.push(`
            (p.name LIKE $${values.length}
            OR address LIKE $${values.length})
        `);
    }

    if (data.hasOwnProperty('owner_id')) {
        values.push(data.owner_id);
        wheres.push(`owner_id=$${values.length}`);
    }
    if (data.hasOwnProperty('start_date_from')) {
        values.push(data.start_date_from);
        wheres.push(`start_date>=$${values.length}`);
    }
    if (data.hasOwnProperty('scheduled_end_date_from')) {
        values.push(data.scheduled_end_date_from);
        wheres.push(`scheduled_end>=$${values.length}`);
    }
    if (data.hasOwnProperty('start_date_to')) {
        values.push(data.start_date_to);
        wheres.push(`start_date<=$${values.length}`);
    }
    if (data.hasOwnProperty('scheduled_end_date_to')) {
        values.push(data.scheduled_end_date_to);
        wheres.push(`scheduled_end<=$${values.length}`);
    }
    if (data.hasOwnProperty('is_multizoned')) {
        values.push(data.is_multizoned);
        wheres.push(`is_multizoned=$${values.length}`);
    }

    if(data.hasOwnProperty('check_active') && data.check_active === true){
        const date = {};
        date.now = new Date();
        date.lastWeek = new Date();
        date.lastWeek.setDate(date.lastWeek.getDate() - 7);
        values.push(date.lastWeek);
        values.push(date.now);
        wheres.push(`
            ((i.date >= $${values.length-1} AND i.date <= $${values.length})
            OR
            (r.creation_date >= $${values.length-1} AND r.creation_date <= $${values.length}))
        `);
    }

    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` GROUP BY p.id, u.id `
    text += ` OFFSET ${offset} LIMIT ${limit}`;


    const res = await db.fetchAll({
        text,
        values,
    });


    return res;
};

module.exports = {
    fetch_projects,
    count,
};
