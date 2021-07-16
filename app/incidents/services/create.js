const db = require('../../../core/db/postgresql');

const getZone = async (id) => db.fetch({
    text: `SELECT *
           FROM zones
           WHERE id = $1 AND is_deleted=FALSE`,
    values: [id],
});

const insertIncident = async (data) => {
    const incidentData = {
        zone_id: data.zone_id,
        type: data.type,
        financial_damage: data.financial_damage,
        human_damage: data.human_damage,
        date: data.date,
        description: data.description,
        reason: data.reason,
        user_id: data.user_id,
    };
    const incident = await db.insertQuery('incidents', incidentData);
    await Promise.all(data.image_ids.map((image) => db.updateQuery('incident_images',
        { incident_id: incident.id }, { id: image })));
    await Promise.all(data.voice_ids.map((voice) => db.updateQuery('incident_voices',
        { incident_id: incident.id }, { id: voice })));
    return incident;
};

module.exports = {
    getZone,
    insertIncident,
};
