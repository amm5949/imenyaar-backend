/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_zones_page_count = async (zone_data) => {
    const size = zone_data.size || 10;
    let text = `
        SELECT COUNT(*) AS count
        FROM zones
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];
    if (Object.prototype.hasOwnProperty.call(zone_data, 'name')) {
        values.push(zone_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'project_id')) {
        values.push(zone_data.project_id);
        wheres.push(`project_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'properties')) {
        values.push(zone_data.properties);
        wheres.push(`properties=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'details')) {
        values.push(zone_data.details);
        wheres.push(`details=$${values.length}`);
    }

    text += wheres.join(' AND ');
    const pages = await db.executeQuery({
        text,
        values,
    });
    return Math.ceil(pages.rows[0].count / size);
};

const fetch_zones = async (zone_data) => {
    const page = zone_data.page || 1;
    const size = zone_data.size || 10;
    let text = `
        SELECT id, name, project_id, properties, details
        FROM zones
        WHERE
    `;
    const values = [];
    const wheres = ['is_deleted = false'];

    if (Object.prototype.hasOwnProperty.call(zone_data, 'name')) {
        values.push(zone_data.name);
        wheres.push(`name=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'project_id')) {
        values.push(zone_data.project_id);
        wheres.push(`project_id=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'properties')) {
        values.push(zone_data.properties);
        wheres.push(`properties=$${values.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(zone_data, 'details')) {
        values.push(zone_data.details);
        wheres.push(`details=$${values.length}`);
    }

    text += wheres.join(' AND ');
    const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    text += ` OFFSET ${offset} LIMIT ${limit}`;
    const res = await db.executeQuery({
        text,
        values,
    });
    const page_count = await fetch_zones_page_count(zone_data);
    const ret_val = {
        values: res.rows,
        page_count,
    };
    return ret_val;
};

module.exports = {
    fetch_zones,
};
