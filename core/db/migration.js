/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const fs = require('fs');
const path = require('path');
const db = require('./postgresql');
const { serial } = require('../util/promise');

// Run migrations.
const up = (filesList, after) => {
    const funcs = filesList.map(
        (file) => async () => {
            const rq = require(file);
            return rq.up().then(() => after(file));
        },
    );

    return serial(funcs);
};

// Bring down migrations
const down = (filesList, after) => {
    const funcs = filesList.map(
        (file) => async () => {
            const rq = require(file);
            return rq.down().then(() => after(file));
        },
    );

    return serial(funcs);
};

const migrate = (directory) => async () => {
    const files = fs.readdirSync(directory)
        .filter((file) => path.extname(file) === '.js');

    const migratedList = (await db.fetchAll('select file from migrations'))
        .map((row) => row.file);

    const migrationFiles = files.filter((file) => migratedList.indexOf(file) < 0)
        .map((file) => `${directory}${file}`);

    const step = await db.fetch(`
        select coalesce(
            (
                select step from migrations order by id desc limit 1
            ), 0) step
    `).then((_step) => _step.step + 1);

    await up(migrationFiles, (file) => db.insertQuery('migrations', {
        file: file.split('/').pop(),
        step,
    }));
};

/**
 * Rollback migrations.
 *
 * @param {integer} stepsCount Number of steps to rollback. 0 means rollback all the steps.
 */
const rollback = (directory) => async (stepsCount = 1) => {
    const stepsCountInTheDatabase = await db.fetch('select count(distinct step) as count from migrations').then((row) => row.count);

    // Calculate after which step should be relled back.
    const stepsToRollback = stepsCount > stepsCountInTheDatabase || stepsCount === 0
        ? 0
        : stepsCountInTheDatabase - stepsCount;

    // Get files from database
    const migrationsToRollBack = await db.fetchAll({
        text: 'select * from migrations where step > $1 order by id desc',
        values: [stepsToRollback],
    });

    // Append directory to files.
    const files = migrationsToRollBack.map((migration) => `${directory}/${migration.file}`);

    // Rollback.
    await down(files, (file) => db.executeQuery({
        text: 'delete from migrations where file = $1',
        values: [file.split('/').pop()],
    }));
};

/**
 * Refresh database.
 *
 * @param {strign} directory Directory of migrations.
 */
const refresh = async (directory) => {
    // First rollback all the migrations
    await rollback(directory)(0);
    // Migrate
    await migrate(directory)(0);
};

/**
 * Migration's table create.
 */
const createTable = async () => db.executeQuery(`
    create table if not exists migrations (
        id serial primary key,
        file varchar(250) not null,
        step int not null
    );
`);

module.exports = {
    createTable,
    migrate,
    rollback,
    refresh,
};
