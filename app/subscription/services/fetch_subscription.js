const db = require ('../../../core/db/postgresql');

const getSubscription = async (id) => {
    const query = `SELECT * FROM subscriptions WHERE id = $1`;
    return await db.fetch({
        text: query,
        values: [id]
    });
}

module.exports = {
    getSubscription,
}
