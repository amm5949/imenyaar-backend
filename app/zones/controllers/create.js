const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/zones create
 * @apiName CreateZone
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription Create a zone
 *
 * @apiParam {String} name, provided in body
 * @apiParam {Number} project_id, provided in body
 * @apiParam {String} properties, provided in body
 * @apiParam {String} details,  provided in body
 *
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    if (await createService.fetch_project(result.data.project_id) === undefined) {
        return error(response, 404, {
            en: 'project not found',
        });
    }
    const zone = await createService.create_zone(result.data);
    return ok(response, zone, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
