const db = require('../../../core/db/postgresql');

const get = async () => {
    return (await db.executeQuery({
        text: 'SELECT * FROM categories',
    })).rows;
};

const getCategoryNames = async () => {
    return (await db.executeQuery ({
        text: 'SELECT id, name FROM categories'
    })).rows;
}
