const db = require('../../../core/db/postgresql');

const listIncidents = (projectID, zoneID, page, size, to = '', from = '') => {
    const values = [(page - 1) * size, size, projectID];
    const where = ['z.project_id = $3'];

    if (from) {
        values.push(from);
        where.push(`i.date >= $${values.length}`);
    }

    if (to) {
        values.push(to);
        where.push(`i.date <= $${values.length}`);
    }

    if (zoneID) {
        values.push(zoneID);
        where.push(`i.zone_id = $${values.length}`);
    }

    const whereString = ` ${where.join(' AND ')}`;
    const text = `SELECT i.id,
                         i.zone_id,
                         i.user_id,
                         i.type,
                         i.financial_damage,
                         i.human_damage,
                         i.date,
                         i.description,
                         i.reason,
                         i.previous_version
                  FROM incidents i
                           JOIN zones z on i.zone_id = z.id
                  WHERE ${whereString}
                  ORDER BY date
                  OFFSET $1 LIMIT $2`;
    return db.fetchAll({ text, values });
};

const count = async (projectID, zoneID, to, from) => {
    const values = [projectID];
    const where = ['z.project_id = $1'];

    if (from) {
        values.push(from);
        where.push(`i.date >= $${values.length}`);
    }

    if (to) {
        values.push(to);
        where.push(`i.date <= $${values.length}`);
    }

    if (zoneID) {
        values.push(zoneID);
        where.push(`i.zone_id = $${values.length}`);
    }

    const whereString = ` ${where.join(' AND ')}`;
    const text = `SELECT count(i.id) as count
                  FROM incidents i
                           JOIN zones z on i.zone_id = z.id
                  WHERE ${whereString}`;
    return db.fetch({ text, values });
};


module.exports = {
    listIncidents,
    count,
};
