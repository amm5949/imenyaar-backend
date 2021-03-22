const config = require('config');
const {
    Pool,
} = require('pg');
const promise = require('../util/promise');

const connnectionConfig = {
    host: config.get('PGHOST'),
    user: config.get('PGUSER'),
    password: config.get('PGPASSWORD'),
    database: config.get('PGDATABASE'),
    port: config.get('PGPORT'),
};
const pool = new Pool(connnectionConfig);
pool.on('error', (err) => {
    throw new Error('Unexpected error on idle client', err);
});

const insertOrUpdate = (query) => {
    const insertQuery = query;
    insertQuery.text += ' RETURNING *;';
    return pool.query(query)
        .then((result) => result)
        .catch((e) => {
            throw e;
        });
};

const executeQuery = (query) => pool.query(query)
    .then((result) => result)
    .catch((e) => {
        throw e;
    });

const fetch = (query) => executeQuery(query).then((result) => result.rows[0]);

const fetchAll = (query) => executeQuery(query).then((result) => result.rows);

const insertManyQuery = (table, data) => {
    let fields = Object.keys(data[0]);
    fields = [...fields];

    let values = [];

    let text = `INSERT INTO ${table} `;
    text += `(${fields.join(',')}) VALUES `;
    let placeholders = [];
    for (let i = 1; i <= fields.length; i += 1) {
        placeholders.push(i);
    }

    for (let i = 0; i < data.length; i += 1) {
        text += ' ( $';
        text += placeholders.join(', $');
        text += ' ),';
        placeholders = placeholders.map((p) => p + fields.length);

        values = [...values, ...Object.values(data[i])];
    }

    text = text.slice(0, -1);

    return insertOrUpdate({ text, values }).then((result) => result.rows);
};

const insertQuery = (table, data) => {
    if (Array.isArray(data)) {
        return insertManyQuery(table, data);
    }
    let fields = Object.keys(data);
    let values = Object.values(data);

    fields = [...fields];
    values = [...values];
    let text = `INSERT INTO ${table} `;
    // Make column names from data keys.
    text += `(${fields.join(',')}) `;

    text += ' VALUES ( ';
    for (let i = 1; i <= values.length; i += 1) {
        text += `$${i},`;
    }
    text = text.slice(0, -1);
    text += ' )';
    return insertOrUpdate({ text, values }).then((result) => result.rows[0]);
};

const updateQuery = (table, data, where) => {
    let text = `UPDATE ${table} SET `;

    const updateData = data;
    const values = Object.values(updateData);
    let c = 0;
    text += Object.keys(updateData).map((field) => {
        c += 1;
        return `${field} = $${c}`;
    }).join(',');

    const wheres = [];
    // eslint-disable-next-line array-callback-return
    Object.entries(where).map(([field, value]) => {
        values.push(value);
        wheres.push(`${field}= $${values.length}`);
    });

    if (wheres.length > 0) {
        text += ` WHERE ${wheres.join(' AND ')}`;
    }

    return insertOrUpdate({ text, values }).then((result) => result.rows);
};
/**
 * Pass an array like this:
 * [
 *  {method: 'GET', url: '/api/reports/', accesses : [1,2]},
 *  {method: 'PUT', url: '/api/reports/', accesses : [1]},
 * ]
 *
 * It will match the ids automatically.
 *
 * @param {array} resourceList List of resources
 */
const resource = async (resourcesList) => {
    const resourcesArray = resourcesList.map(({ method, url }) => ({
        url, method,
    }));

    const resources = await insertQuery('resources', resourcesArray);

    const accesesList = resourcesList.map(
        ({ method, url, accesses }) => accesses.map(
            (roleId) => ({
                resource_id: resources.find((res) => res.url === url && res.method === method).id,
                role_id: roleId,
            }),
        ),
    ).flat();

    await insertQuery('accesses', accesesList);

    return true;
};

const dropResources = async (resourcesList) => {
    const promises = resourcesList.map(async ({ method, url }) => {
        const records = await fetchAll({
            text: 'select id from resources where url = $1 and method = $2',
            values: [url, method],
        });

        const resourceIds = records.map((res) => res.id);

        await executeQuery({
            text: 'delete from accesses where resource_id = ANY($1)',
            values: [resourceIds],
        });

        await executeQuery({
            text: 'delete from resources where id = ANY($1)',
            values: [resourceIds],
        });
    });

    await Promise.all(promises);
    return true;
};

module.exports = {
    insertOrUpdate,
    executeQuery,
    fetch,
    fetchAll,
    insertManyQuery,
    insertQuery,
    updateQuery,
    resource,
    dropResources,
};
