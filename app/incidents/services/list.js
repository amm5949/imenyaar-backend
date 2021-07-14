/* eslint-disable camelcase */
const { fetchAll } = require('../../../core/db/postgresql');
const { fetch } = require('../../../core/db/postgresql');

exports.all = async ({ page, size, ...filter } = { page: 1, size: 10, user_id: undefined }) => {
    let values = [(parseInt(page, 10) - 1) * size, parseInt(size, 10)];
    let where = [];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values = [...values, filter.user_id];
        where = [...where, `i.user_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('zone_id')) {
        values = [...values, parseInt(filter.zone_id, 10)];
        where = [...where, `i.zone_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('from')) {
        values = [...values, filter.from];
        where = [...where, `i.date >= $${values.length}`];
    }

    if (filter.hasOwnProperty('to')) {
        values = [...values, filter.to];
        where = [...where, `i.date <= $${values.length}`];
    }

    const whereString = (where.length > 0)? 'WHERE ' + where.join(' AND ') : '';

    const text = `
        SELECT
            i.*,
            u.first_name,
            u.last_name
        FROM incidents i
        INNER JOIN users u ON u.id = i.user_id
        ${whereString}
        ORDER BY i.date DESC
        OFFSET $1
        LIMIT $2
    `;
    const query = {
        text,
        values,
    };
    const result = await fetchAll(query);
    return result;
};


// count entries with current filter
exports.count = (filter) => {
    let values = [];
    let where = [];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values = [...values, filter.user_id];
        where = [...where, `i.user_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('zone_id')) {
        values = [...values, parseInt(filter.zone_id, 10)];
        where = [...where, `i.zone_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('from')) {
        values = [...values, filter.from];
        where = [...where, `i.date >= $${values.length}`];
    }

    if (filter.hasOwnProperty('to')) {
        values = [...values, filter.to];
        where = [...where, `i.date <= $${values.length}`];
    }

    const whereString = (where.length > 0)? 'WHERE ' + where.join(' AND ') : '';
    return fetch({
        text: `
            SELECT COUNT(*) FROM incidents i
	        INNER JOIN users u ON u.id = i.user_id
            ${whereString}
        `,
        values,
    });
};

