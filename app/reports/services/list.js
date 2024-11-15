/* eslint-disable camelcase */
const { fetchAll } = require('../../../core/db/postgresql');
const { fetch } = require('../../../core/db/postgresql');

exports.all = ({ page, size, ...filter } = { page: 1, size: 10, user_id: undefined }) => {
    const values = [];
    values.push((parseInt(page, 10) - 1) * size, parseInt(size, 10));
    const where = [ 'parent_id is NULL', 'r.is_deleted = false', 'u.is_deleted = false'];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values.push(filter.user_id);
        where.push(`r.user_id = $${values.length}`);
    }

    if (filter.hasOwnProperty('from')) {
        values.push(filter.from);
        where.push(`r.creation_date >= $${values.length}`);
    }

    if (filter.hasOwnProperty('to')) {
        values.push(filter.to);
        where.push(`r.creation_date <= $${values.length}`);
    }

    if (filter.hasOwnProperty('project_id')) {
        values.push(filter.project_id);
        where.push(`p.id = $${values.length}`);
    }

    const whereString = ` ${where.join(' AND ')}`;
    const text = `
        SELECT
            r.id,
            r.activity_id,
            r.zone_id,
            r.creation_date,
            r.user_id,
            z.name as zone_name,
            p.name as project_name,
            a.name as activity_name,
            u.first_name,
            u.last_name
        FROM reports r
        INNER JOIN users u ON u.id = r.user_id
        INNER JOIN zones z ON z.id = r.zone_id
        INNER JOIN projects p ON p.id = z.project_id
        INNER JOIN activities a ON a.id = r.activity_id
        WHERE ${whereString}
        ORDER BY id DESC
        OFFSET $1
        LIMIT $2
    `;
    const query = {
        text,
        values,
    };

    return fetchAll(query);
};


// count entries with current filter
exports.count = (filter) => {
    const values = [];
    const where = [ 'parent_id is NULL', 'r.is_deleted = false', 'u.is_deleted = false'];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values.push(filter.user_id);
        where.push(`r.user_id = $${values.length}`);
    }

    if (filter.hasOwnProperty('from')) {
        values.push(filter.from);
        where.push(`r.creation_date >= $${values.length}`);
    }

    if (filter.hasOwnProperty('to')) {
        values.push(filter.to);
        where.push(`r.creation_date <= $${values.length}`);
    }

    if (filter.hasOwnProperty('project_id')) {
        values.push(filter.project_id);
        where.push(`p.id = $${values.length}`);
    }

    const whereString = ` ${where.join(' AND ')}`;
    return fetch({
        text: `
            SELECT COUNT(*) FROM reports r
	        INNER JOIN users u ON u.id = r.user_id
            INNER JOIN zones z ON z.id = r.zone_id
            INNER JOIN projects p ON p.id = z.project_id            
            WHERE ${whereString}
        `,
        values,
    });
};
