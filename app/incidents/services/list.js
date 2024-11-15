const db = require('../../../core/db/postgresql');

const listIncidents = (projectID, zoneID, activityID, page, size, to = '', from = '') => {
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

    if (activityID) {
        values.push(activityID);
        where.push(`i.activity_id = $${values.length}`);
    }

    const whereString = ` ${where.join(' AND ')}`;
    const text = `SELECT i.*,
                            a.name as activity_name,
                            z.name as zone_name,
                            p.name as project_name,
                            u.first_name, u.last_name
                  FROM incidents i
                           JOIN zones z on i.zone_id = z.id
                           JOIN projects p on p.id = z.project_id
                           JOIN activities a on a.id = i.activity_id
                           JOIN users u on u.id = i.user_id
                  WHERE ${whereString}
                  ORDER BY date
                  OFFSET $1 LIMIT $2`;
    return db.fetchAll({ text, values });
};

const count = async (projectID, zoneID, activityID, to, from) => {
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

    if (activityID) {
        values.push(activityID);
        where.push(`i.activity_id = $${values.length}`);
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
