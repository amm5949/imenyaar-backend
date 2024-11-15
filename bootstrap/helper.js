/* eslint-disable no-console */
const BASEDIR = `${__dirname}/..`;
process.env.NODE_CONFIG_DIR = `${BASEDIR}/config`;

const { program } = require('commander');
require('config');
const fs = require('fs');
const chalk = require('chalk');
const db = require('../core/db/postgresql');
const auth = require('../core/auth/auth');
const migration = require('../core/db/migration');

program.version('0.0.1');

// Create user

program.command('create-user <phone_number> <password> <role> [first_name] [last_name]')
    .description('Create a user')
    .action(async (phone_number, password, role, first_name, last_name) => {
        const record = await db.insertQuery('users', {
            phone_number,
            password: password,
            first_name: first_name || phone_number,
            last_name: last_name || phone_number,
            is_active: true,
            is_verified: true,
            is_deleted: false,
        });

        await db.insertQuery('user_roles', {
            user_id: record.id,
            role_id: role,
        });

        console.log(chalk.bgWhite.blackBright('User created successfully.'));
        console.log();
        console.log(`${chalk.bgGreen.white('Token:')} ${auth.signToken({
            id: record.id,
        })}`);
    });

program.command('get-token <phone_number>')
    .description('Get token for the user.')
    .action(async (phone_number) => {
        const record = await db.fetch({
            text: 'select * from users where phone_number = $1',
            values: [phone_number],
        });

        console.log(`${chalk.bgWhiteBright.black('Token:')} ${auth.signToken({
            id: record.id,
        })}`);
    });

program.command('migration:table')
    .description('Create migrations table')
    .action(() => migration.createTable().then(() => console.log('Table created successfuly!')));

program.command('migration:migrate')
    .description('Run migrations')
    .action(async () => {
        await migration.migrate(`${BASEDIR}/migrations/`)();

        console.log('Migration complete!');
    });

program.command('migration:rollback')
    .option('--step <step>')
    .description('Rollback migrations')
    .action(async (option) => {
        const { step = 1 } = option;

        await migration.rollback(`${BASEDIR}/migrations/`)(parseInt(step, 10));

        console.log('Rollback complete!');
    });

program.command('migration:refresh')
    .description('Refresh database')
    .action(async () => {
        await migration.refresh(`${BASEDIR}/migrations/`);

        console.log('Refresh complete!');
    });
program.command('migration:file <file>')
    .description('Create migrations table')
    .action((file) => {
        fs.writeFileSync(`${BASEDIR}/migrations/${Date.now()}_${file}.js`, `const db = require('../core/db/postgresql');

const up = () => db.executeQuery('');
const down = () => db.executeQuery('drop table table_name');

module.exports = {
    up,
    down,
};
`);
    });
program.parseAsync(process.argv);
