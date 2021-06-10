/* eslint-disable camelcase */
const { fetchAll } = require('../../../core/db/postgresql');
const { fetch } = require('../../../core/db/postgresql');

exports.all = ({ page, size, ...filter } = { page: 1, size: 10, user_id: undefined }) => {
    let values = [(parseInt(page, 10) - 1) * size, parseInt(size, 10)];
    let where = ['r.is_deleted = false', 'u.is_deleted = false'];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values = [...values, filter.user_id];
        where = [...where, `r.user_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('from')) {
        values = [...values, filter.from];
        where = [...where, `r.creation_date >= $${values.length}`];
    }

    if (filter.hasOwnProperty('to')) {
        values = [...values, filter.to];
        where = [...where, `r.creation_date <= $${values.length}`];
    }

    const whereString = where.join(' AND ');
    const text = `
        SELECT
            r.id,
            r.activity_id,
            r.zone_id,
            r.creation_date,
            r.user_id,
            u.first_name,
            u.last_name
        FROM reports r
        INNER JOIN users u ON u.id = r.user_id
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
    let values = [];
    let where = ['r.is_deleted = false', 'u.is_deleted = false'];

    if (filter.hasOwnProperty('user_id') && filter.user_id !== undefined) {
        values = [...values, filter.user_id];
        where = [...where, `r.user_id = $${values.length}`];
    }

    if (filter.hasOwnProperty('from')) {
        values = [...values, filter.from];
        where = [...where, `r.creation_date >= $${values.length}`];
    }

    if (filter.hasOwnProperty('to')) {
        values = [...values, filter.to];
        where = [...where, `r.creation_date <= $${values.length}`];
    }

    const whereString = where.join(' and ');
    return fetch({
        text: `
            SELECT COUNT(*) FROM reports r
	        INNER JOIN users u ON u.id = r.user_id
            WHERE ${whereString}
        `,
        values,
    });
};
