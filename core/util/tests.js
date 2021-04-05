// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const db = require('../db/postgresql');
const auth = require('../auth/auth');
const migration = require('../db/migration');

/**
 * Create a user with given role id and fields.
 * Fields values will be generated by function if theu are not passed.
 *
 * @param {integer} roleId Role id.
 * @param {object} fields Customized fiels.
 */
const user = async (roleId, fields = {}) => {
    const {
        username = faker.internet.userName(),
        password = faker.internet.password(),
        first_name: firstName = faker.name.firstName(),
        last_name: lastName = faker.name.lastName(),
        is_active: isActive = true,
        is_deleted: isDeleted = false,
    } = fields;

    const userRecord = await db.insertQuery('users', {
        username,
        password: auth.createHash(password).passwordHash,
        first_name: firstName,
        last_name: lastName,
        is_active: isActive,
        is_deleted: isDeleted,
    });

    const role = await db.insertQuery('user_roles', {
        role_id: roleId,
        user_id: userRecord.id,
    });

    const token = auth.signToken({
        payload: userRecord.id,
    });

    return {
        user: { ...userRecord, plain_password: password },
        role,
        token,
        header: `Bearer ${token}`,
    };
};

/**
 * Refreshes database.
 *
 * @param {string} directory Path to migrations folder. Default is `PROJ_ROOT/migrations`.
 */
const refreshDatabase = (directory = `${__dirname}/../../migrations/`) => {
    migration.refresh(directory);
};

module.exports = {
    user,
    refreshDatabase,
};