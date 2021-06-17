const { date } = require('faker');
const db = require('../../../core/db/postgresql');

const checkPeople = async (userId, projectId) => {
    currentUsers = await db.fetch({
        text: `SELECT count(*) FROM project_people
        WHERE project_id = $1`,
        values: [projectId]
    });

    date = new Date();
    maxUsers = await db.fetch({
        text: `SELECT person_per_project FROM account_types at, subscriptions s
        WHERE s.user_id = $1 AND at.id = s.account_type_id
        AND end_date >= $2
        AND start_date <= $2`,
        values: [userId, date]
    });
    return (currentUsers < maxUsers);
}

const checkProjects = async (userId) => {
    currentProjects = await db.fetch ({
        text: `SELECT count(p.id) FROM projects p
        WHERE p.owner_id = $1 AND is_deleted = FALSE`
    });

    date = new Date();
    maxProjects = await db.fetch ({
        text: `SELECT allowed_project_count FROM account_types at, subscriptions s
        WHERE s.user_id = $1 AND at.id = s.account_type_id
        AND end_date >= $2
        AND start_date <= $2`,
        values: [userId, date]
    })

    return (current_projects < max_projects);
}

const checkSubscription = async (userId) => {
    date = new Date();
    subscription = await db.fetchAll({
        text: `SELECT * FROM subscriptions s, account_types at
        WHERE s.account_type_id = at.id
        AND s.user_id = $1
        AND end_date >= $2
        AND start_date <= $2`
    });

    return subscription;
}

module.exports = {
    checkPeople,
    checkProjects,
    checkSubscription,
}
