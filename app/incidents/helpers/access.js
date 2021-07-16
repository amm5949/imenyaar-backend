exports.byIncident = async (user, incident) => {
    const project = await db.fetch({
        text: `
        SELECT p.* FROM projects p
        INNER JOIN zones z ON z.project_id = p.id
        WHERE z.id = $1`,
        values: [incident.zone_id]
    });
    
    return (
    (user.roles[0].id === 1)
    || (user.roles[0].id === 2 && user.id === project.owner_id)
    || (user.id == incident.user_id)
    )
};
