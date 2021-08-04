const db = require('../../../core/db/postgresql');


const fetchUser = async (id, hasAccess) => {
    const user = await db.fetch({
        text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified
            FROM users
            WHERE is_deleted = false AND id = $1`,
        values: [id],
    });
    if (!user || !hasAccess) {
        return {...user};
    }
    const subscriptionData = await db.fetchAll({
        text: `SELECT * FROM subscriptions WHERE user_id = $1`,
        values: [id]
    });
    return {
        user: user,
        subscriptions: subscriptionData,
    };
}

module.exports = {
    fetchUser,
};
