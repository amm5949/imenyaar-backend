const db = require('../../../core/db/postgresql');
exports.byReport = async (user, report) => {
    const project = await db.fetch({
        text: `
        SELECT p.* FROM projects p
        INNER JOIN zones z ON z.project_id = p.id
        WHERE z.id = $1`,
        values: [report.zone_id]
    });
    
    return (
    (user.roles[0].id === 1)
    || (user.roles[0].id === 2 && user.id === project.owner_id)
    || (user.id === report.user_id)
    )
};

exports.byActivity = (user, activity) => (
    (user.roles[0].id === 1
        || (activity.people.includes(user.id)))
)
