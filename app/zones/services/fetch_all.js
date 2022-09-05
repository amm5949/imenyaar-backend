/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_zones_page_count = async (zone_data, user) => {
    const size = zone_data.size || 10;
    let text = `
        SELECT COUNT(z.*) AS count
        FROM zones z
        INNER JOIN projects pp ON pp.id = z.project_id 
        WHERE
    `;
    const values = [];
    const wheres = ['z.is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(zone_data, 'name')) {
        values.push(zone_data.name);
        wheres.push(`z.name LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'project_id')) {
        values.push(zone_data.project_id);
        wheres.push(`z.project_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'properties')) {
        values.push(zone_data.properties);
        wheres.push(`z.properties LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'details')) {
        values.push(zone_data.details);
        wheres.push(`z.details LIKE $${values.length}`);
    }


    values.push(user.id);
    wheres.push(`(pp.owner_id = $${values.length} OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) OR $${values.length} IN (SELECT user_id FROM project_people ppp WHERE ppp.project_id=pp.id and is_deleted=false))`);

    text += wheres.join(' AND ');
    const pages = await db.executeQuery({
        text,
        values,
    });
    return Math.ceil(pages.rows[0].count / size);
};

const fetch_zones = async (zone_data, user) => {
    const page = zone_data.page || 1;
    const size = zone_data.size || 10;
    let text = `
        SELECT z.id, z.name, z.project_id, pp.name as project_name, z.properties, z.details
        FROM zones z
        INNER JOIN projects pp ON pp.id = z.project_id 
        WHERE
    `;
    const values = [];
    const wheres = ['z.is_deleted = false'];

    if (Object.prototype.hasOwnProperty.call(zone_data, 'name')) {
        values.push(zone_data.name);
        wheres.push(`z.name LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'project_id')) {
        values.push(zone_data.project_id);
        wheres.push(`z.project_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'properties')) {
        values.push(zone_data.properties);
        wheres.push(`z.properties LIKE $${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'details')) {
        values.push(zone_data.details);
        wheres.push(`z.details LIKE $${values.length}`);
    }

    values.push(user.id);
    wheres.push(`(pp.owner_id = $${values.length} OR $${values.length} in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) OR $${values.length} IN (SELECT user_id FROM project_people ppp WHERE ppp.project_id=pp.id and is_deleted=false))`);

    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` OFFSET ${offset} LIMIT ${limit}`;
    const res = await db.executeQuery({
        text,
        values,
    });
    const page_count = await fetch_zones_page_count(zone_data, user);
    const ret_val = {
        items: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_zones,
};
