const { v4: uuidv4 } = require('uuid');
const { ok, error } = require('../../../core/util/response');
const imageService = require('../services/image');

/**
 * @api {post} /api/incidents/:id/images Add images
 * @apiGroup Incidents
 * @apiName AddImages
 * @apiVersion 1.0.0
 * @apiDescription Add images to incident
 * @apiParam (Path param) {number} id Id
 * @apiParam {files[]} images Images
 */
const addImage = async (request, response) => {
    const { id } = request.params;
    const incident = await imageService.fetchIncident(id);
    if (!incident) {
        return error(response, 404, { en: 'Incident does not exist' });
    }
    const images = Array.isArray(request.files.images) ? request.files.images
        : [request.files.images];
    const paths = images.map((i) => {
        const path = `uploads/incident/${id}-${uuidv4()}-${i.name}`;
        i.mv(path);
        return path;
    });
    if (images.length) {
        await imageService.save(id, paths);
    }
    return ok(response, {});
};

module.exports = async (request, response) => {
    await addImage(request, response);
};
