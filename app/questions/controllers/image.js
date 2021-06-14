const { v4: uuidv4 } = require('uuid');
const { ok, error } = require('../../../core/util/response');
const imageService = require('../services/image');

/**
 * @api {post} /api/questions/:id/images Add images
 * @apiGroup Questions
 * @apiName AddImages
 * @apiVersion 1.0.0
 * @apiDescription Add images to questions
 * @apiParam (Path param) {number} id Id
 * @apiParam {files[]} images Images
 */
const addImage = async (request, response) => {
    const { id } = request.params;
    const question = await imageService.fetchQuestion(id);
    if (!question) {
        return error(response, 404, { en: 'question does not exist' });
    }
    const images = Array.isArray(request.files.images) ? request.files.images
        : [request.files.images];
    const paths = images.map((i) => {
        const path = `uploads/${id}-${uuidv4()}-${i.name}`;
        i.mv(path);
        return path;
    });
    if (images.length) {
        imageService.save(id, paths);
    }
    return ok(response, {});
};

module.exports = async (request, response) => {
    await addImage(request, response);
};
