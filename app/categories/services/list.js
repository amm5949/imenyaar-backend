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


const getCategory = async (id) => {
    return (await db.executeQuery ({
        text: `SELECT id, name 
            FROM categories
             WHERE id = $1`,
        values: [id]
    })).rows;
}

module.exports = {
    get,
    getCategoryNames,
    getCategory
}
