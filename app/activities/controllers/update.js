/* eslint-disable camelcase */
const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const updateSchema = require('../schemas/update');
const createService = require('../services/create');
const accessCheck = require('../../projects/services/accessCheck.js');
/**
 * @api {put} /api/activities/:id Update
 * @apiName UpdateActivity
 * @apiGroup Activity
 * @apiVersion 1.0.0
 * @apiDescription Update an activity
 *
 * @apiParam {Number} project_id  
 * @apiParam {Array} people array of people associated with this activity, it will replace the previous array of members, note that non acceptable ones are ignored
 * @apiParam {Array} zones array of zones associated with this activity, it will replace the previous array of members, note that non acceptable ones are ignored
 * @apiParam {Number} status provided in body
 * @apiParam {Date} start_date acceptable format is "new Date()" provided in body
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()" provided in body
 * @apiParam {Boolean} is_done provided in body
 *
 *
 */

const update = async (request, response) => {
    const { id } = request.params;
    const result = validator(updateSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    const activity_details = data;
    const activity = await updateService.fetch_activity(id);
    if (activity === undefined) {
        return error(response, 404, {
            en: 'activity not found',
        });
    }
    if (!(await accessCheck(request.user, activity.project_id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    if (Object.prototype.hasOwnProperty.call(activity_details, 'project_id')) {
        if (!(await accessCheck(request.user, data.project_id))) {
            return error(response, 403, {
                en: 'you don\'t have access to this project',
            });
        }
    }
    if (Object.prototype.hasOwnProperty.call(activity_details, 'zones')) {
        const len = activity_details.zones.length;
        activity_details.zones = await createService.test_zones(activity_details.zones);
        if (activity_details.zones.length === 0 && len !== 0) {
            delete activity_details.zones;
        }
    }
    if (Object.prototype.hasOwnProperty.call(activity_details, 'people')) {
        const len = activity_details.zones.length;
        activity_details.people = await createService.test_users(activity_details.people); 
        if (activity_details.people.length === 0 && len !== 0) {
            delete activity_details.people;
        }
    }

    if (Object.keys(activity_details).length === 0) {
        return error(response, 400, {
            en: 'No acceptable updates were provided.',
        });
    }
    const updated_activity = await updateService.update_activity(id, activity_details);
    return ok(response, updated_activity, { en: 'activity updated' }, 200);
};

module.exports = async (request, response) => {
    await update(request, response);
};
