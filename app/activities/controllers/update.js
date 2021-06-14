/* eslint-disable camelcase */
const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/update');

/**
 * @api {put} /api/activities/:id Update
 * @apiName UpdateActivity
 * @apiGroup Activity
 * @apiVersion 1.0.0
 * @apiDescription Update an activity
 *
 * @apiParam {Number} person_id provided in body
 * @apiParam {string} status provided in body
 * @apiParam {Date} start_date acceptable format is "new Date()" provided in body
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()" provided in body
 * @apiParam {Boolean} is_done provided in body
 *
 *
 */

const update = async (request, response) => {
    const { id } = request.params;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    const activity = await updateService.fetch_activity(id);
    if (activity === undefined) {
        return error(response, 404, {
            en: 'activity not found',
        });
    }
    if (Object.keys(data).length === 0) {
        return error(response, 400, {
            en: 'No updates were provided.',
        });
    }
    const updated_project = await updateService.update_activity(id, data);
    return ok(response, updated_project, { en: 'activity updated' }, 200);
};

module.exports = async (request, response) => {
    await update(request, response);
};
