const db = require('../../../core/db/postgresql');

module.exports = async (images, voices) => {

    if (images.length > 0) {
        imageRes = await db.insertQuery('answer_images', images.map(
            ({ path }) => ({
                path
            }),
        ));
    }

    if (voices.length > 0) {
        voiceRes = await db.insertQuery('answer_voices', voices.map(({ path }) => ({
            path
        })));
    }

    return {
        imageRes,
        voiceRes
    };
};
