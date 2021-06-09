/* eslint-disable camelcase */
const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/update');

/**
 * @api {put} /api/zones/:id Update
 * @apiName UpdateZone
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription Update a zone
 *
 * @apiParam {String} name provided in body
 * @apiParam {Number} project_id provided in body
 * @apiParam {String} properties provided in body
 * @apiParam {String} details  provided in body
 *
 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "zone updated",
        "fa": "درخواست موفقیت آمیز بود"
    }
}
 * @apiErrorExample {json} Validation error.
HTTP/1.1 422
 *
 */

const update = async (request, response) => {
    const { id } = request.params;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    const zone = await updateService.fetch_zone(id);
    if (zone === undefined) {
        return error(response, 404, {
            en: 'zone not found',
        });
    }
    if (Object.keys(data).length === 0) {
        return error(response, 400, {
            en: 'No updates were provided.',
        });
    }
    if (Object.prototype.hasOwnProperty.call(data, 'project_id')) {
        if (await updateService.fetch_project(data.project_id) === undefined) {
            return error(response, 404, {
                en: 'project not found',
            });
        }
    }
    const updated_zone = await updateService.update_zone(id, data);
    return ok(response, updated_zone, { en: 'zone updated' }, 200);
};

module.exports = async (request, response) => {
    await update(request, response);
};
