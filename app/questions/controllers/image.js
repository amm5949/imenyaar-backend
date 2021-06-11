const { ok } = require('../../../core/util/response');
const imageService = require('../services/image');
/**
 * @api {post} /api/questions/:id/images AddImage
 * @apiGroup Questions
 * @apiName AddImage
 * @apiVersion 1.0.0
 * @apiDescription Add an image to a question.
 * 
 * @apiParam (file) {file[]} images Image files to upload.
 */
const addImage = async (request, response) => {
    const { id } = request.params;
    const images = Array.isArray(request.files.images) ? request.files.images
        : [request.files.images];
    const paths = images.map((i) => {
        const path = `uploades/${id}-${i.name}`;
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
