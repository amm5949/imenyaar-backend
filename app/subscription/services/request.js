const db = require('../../../core/db/postgresql');
const checkout = require('zarinpal-checkout').create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);


const requestSubscription = async (user_id, account_type_id) => {
    let query = `SELECT * FROM account_types at WHERE id = $1`;
    const accountType = await db.fetch({
        text: query, 
        values: [account_type_id]
    });
    if (accountType === undefined) {
        return { error: 'Account subscription type not found.' }
    }
    let date = new Date();
    let end_date = new Date();
    end_date.setDate(end_date.getDate() + accountType.duration_days);
    let data = {
        account_type_id: account_type_id,
        user_id: user_id,
        // can include calculation for tax, discount, etc.
        cost: accountType.price,
        // by default the subscription starts from the same day
        start_date: date,
        end_date: end_date
    };
    const activeSubscriptions = await db.fetch({
        text: `SELECT * FROM subscriptions s
        INNER JOIN account_types at ON at.id = s.account_type_id
        WHERE s.user_id = $1
        AND end_date >= $2
        AND is_verified = true
        ORDER BY end_date DESC`,
        values: [user_id, date]
    });
    // if there are other subscriptions active, set start date to end of the latest one.
    if (activeSubscriptions !== undefined) {
        data.start_date = activeSubscriptions.end_date;
        // because js date is dumb.
        data.end_date = new Date(data.start_date);
        data.end_date.setDate(data.start_date.getDate() +  parseInt(accountType.duration_days, 10));
    }
    const subscription = await db.insertQuery('subscriptions', data);
    return subscription;
};

const assignReceipt = async (subscription_id, authority, data={}) => {
    const query = `UPDATE subscriptions SET authority = $2, is_verified = $3 WHERE id = $1`
    const res = await db.insertOrUpdate({
        text: query,
        values: [subscription_id, authority, data.verify || false]
    });
    return res.rows[0];
}



module.exports = {
    requestSubscription,
    assignReceipt,
};
