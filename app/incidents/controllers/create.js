const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const createService = require('../services/create');
const activityService = require('../../activities/services/fetch');
const subscriptionService = require('../../subscription/services/check');
const accessHelper = require('../helpers/access');

/**
 * @api {post} /api/incidents Create
 * @apiGroup Incidents
 * @apiName Create Incident
 * @apiVersion 1.0.0
 * @apiDescription Create a new incident, `zone_id` and `activity_id` are both required,
 * hence incident can be submitted only by an authorised user for an assigned activity.
 * 
 * @apiParam {number} activity_id id of the relevant activity
 * @apiParam {number} zone_id id of the zone incident belongs to
 * @apiParam {string} type Type of incident, can be anything
 * @apiParam {number} financial_damage financial damage
 * @apiParam {number} human_damage human damage
 * @apiParam {string} description description
 * @apiParam {string} reason reason
 * @apiParam {string} date acceptable format is `new Date()` provided in sample
 * 
 * @apiSuccess {Object} result.incident Incident details
 * @apiSuccess {String} [result.errors]  If present, it indicates errors with attaching voice files 
 *                                      (i.e. current subscription doesn't support voice attachments).
 * @apiSuccessExample success-example:
 *  HTTP/1.1 200
 *{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "incident":
        {
            "id": 4,
            "activity_id": 3,
            "zone_id": 1,
            "user_id": "1",
            "type": "some type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-13T12:35:34.659Z",
            "description": "some info",
            "reason": "someone was tired",
            "previous_version": null
        },
        "errors": "cannot attach voice files."
    }
}
 * @apiParamExample {json} request-example:
 * {
    "activity_id": 3,
    "zone_id":1,
    "type":"some type",
    "financial_damage":1000,
    "human_damage":1500,
    "date":"2021-07-13T17:05:34.659Z",
    "description":"some info",
    "reason":"someone was tired",
    "image_ids":[12, 2],
    "voice_ids":[13, 41]
}

 * @apiError (404) NotFound Zone/Activity not found.
 * @apiError (400) BadRequest Invalid date format.
 * @apiError (403) Forbidden User doesn't have access to incidents module (subscription upgrade required).
 */

const create = async (request, response) => {
    const createValidator = validator(createSchema, request.body);
    const {user} = request;
    if (createValidator.failed) {
        return createValidator.response(response);
    }
    const data = {
        ...createValidator.data,
        user_id: user.id,
        image_ids: createValidator.data.image_ids,
        voice_ids: createValidator.data.voice_ids,
    };
    const zone = await createService.getZone(data.zone_id);
    const activity = await activityService.fetch_activity(data.activity_id, user);

    if (zone === undefined || activity === undefined) {
        return error(response, 404, {
            en: 'No such zone/activity exists',
            fa: 'منطقه یا فعالیت داده شده وجود ندارد',
        });
    }
    if (!accessHelper.byActivity(user, activity)){
        return error(response, 403, {
            en:  "You don't have access to this module.",
            fa: 'شما به این قسمت دسترسی ندارید.'
        });
    }
    if (user.roles[0].name !== 'admin' && !(await 
        subscriptionService.checkByUser(user.id, 'can_access_incident', {zone_id: data.zone_id})
        )){
        return error(response, 403, {
            en:  "You don't have access to this module.",
            fa: 'شما به این قسمت دسترسی ندارید.'
        });
    }
    if (Number.isNaN(Date.parse(data.date))) {
        return error(response, 400, { 
            en: 'invalid date format.',
            fa: 'فرمت تاریخ معتبر نمی‌باشد.'
        });
    }

    const incident = await createService.insertIncident(data);
    return ok(response, incident);
};

module.exports = async (request, response) => {
    await create(request, response);
};
