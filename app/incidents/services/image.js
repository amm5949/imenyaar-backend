const db = require('../../../core/db/postgresql');

const fetchIncident = async (id) => db.fetch({
    text: 'SELECT * FROM incidents WHERE id=$1',
    values: [id],
});

const save = async (id, paths) => {
    const images = paths.map((path) => ({
        path,
        question_id: id,
    }));
    return db.insertQuery('incident_photos', images);
};

module.exports = {
    save,
    fetchIncident,
};
