const db = require('../../../core/db/postgresql');
const subscriptionService = require('../../subscription/services/check');

const getZone = async (id) => db.fetch({
    text: `SELECT *
           FROM zones
           WHERE id = $1 AND is_deleted=FALSE`,
    values: [id],
});

const insertIncident = async (data) => {
    let errors;
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

    // this could be checked in files.js 
    // but that requires checking which project the user is pushing into
    // can be modified in future versions.
    // a better practice is checking user's access *before* uploading files separately.
    if(data.voice_ids.length) {
        const userRole = await db.fetch({
            text: `SELECT r.id, r.name as name FROM user_roles ur
                    INNER JOIN roles r on ur.role_id = r.id
                    WHERE ur.user_id = $1
                    ORDER BY r.id ASC`,
            values: [data.user_id]
        });
        const projectId = (await db.fetch({
            text: `SELECT project_id FROM incidents i 
            INNER JOIN zones z ON z.id = i.zone_id 
            WHERE i.id = $1`,
            values: [incident.id]
        })).project_id;

        const canVoice = (
            userRole.name === 'admin' 
            || await subscriptionService.checkByUser(data.user_id, 'can_send_voice', {project_id: projectId})
            );
        
        if (canVoice){
            await Promise.all(data.voice_ids.map((voice) => 
                db.updateQuery('incident_voices',
                    { incident_id: incident.id }, { id: voice }
                )));
        }
        else {
            errors = 'cannot attach voice files.';
        }
    }
    const res = Object.assign({incident}, errors && {errors});
    return res;
};

module.exports = {
    getZone,
    insertIncident,
};
