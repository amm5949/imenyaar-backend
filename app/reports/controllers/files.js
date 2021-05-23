const getService = require('../services/get');
const filesService = require('../services/files');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../helpers/access');
/**
 * @api {post} /api/reports/:id/files Files of the report
 * @apiGroup Reports
 * @apiName Files
 * @apiVersion 1.0.0
 *
 * @apiParam (Path param) id Report id
 *
 * @apiDescription
 *  Use this endpoint to send files of the report.<br>
 *  File's field name should be: image-{questionId} or voice-{questionId} based on whether it is a image or voice.
 */
module.exports = async (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const report = await getService(id);
    const files = Object.entries(request.files || {});

    const voiceFiles = files.filter(([name]) => name.substr(0, 5) === 'voice');
    const imageFiles = files.filter(([name]) => name.substr(0, 5) === 'image');

    // Check access
    if (!accessCheck(user, report)) {
        return error(response, 403, {});
    }

    const store = (image, part, questionId, index) => {
        const type = image.name.split('.').pop();
        const path = `uploads/${part}/${id}-${questionId}-${index}.${type}`;
        image.mv(path);
        return path;
    };

    const images = imageFiles.map(([name, filesList]) => {
        // if (!acceptableImageMimeTypes.find(image.mimetype)) {
        //     return undefined;
        // }

        // Store image.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((image, idx) => ({
            path: store(image, 'images', name.substr(6), idx),
            questionId: name.substr(6),
        }));
    }).flat();

    const voices = voiceFiles.map(([name, filesList]) => {
        // if (!acceptableImageMimeTypes.find(image.mimetype)) {
        //     return undefined;
        // }

        // Store voice.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((voice, idx) => ({
            path: store(voice, 'voices', name.substr(6), idx),
            questionId: name.substr(6),
        }));
    }).flat();

    await filesService(id, images, voices);

    return ok(response, {});
};
