const db = require('../../../core/db/postgresql');

const insertFiles = async (images, voices) => {
    let imageResults;
    let voiceResults;
    if (images.length > 0) {
        imageResults = await db.insertQuery('incident_images', images.map(({ path }) => ({ path })));
    }

    if (voices.length > 0) {
        voiceResults = await db.insertQuery('incident_voices', voices.map(({ path }) => ({ path })));
    }

    return { imageResults, voiceResults };
};

module.exports = {
    insertFiles,
};
