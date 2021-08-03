const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const createService = require('../services/create');
const subscriptionService = require('../../subscription/services/check');

/**
 * @api {post} /api/incidents Create
 * @apiGroup Incidents
 * @apiName CreateIncident
 * @apiVersion 1.0.0
 * @apiDescription Create a new incident
 * @apiParam {number} zone_id id of the zone incident belongs to
 * @apiParam {string} type Type of incident, can be anything
 * @apiParam {number} financial_damage financial damage
 * @apiParam {number} human_damage human damage
 * @apiParam {string} description description
 * @apiParam {string} reason reason
 * @apiParam {integer} hour Hour of incident
 * @apiParam {string} date acceptable format is "new Date()" provided in body
 * @apiSuccessExample success-example:
 *  HTTP/1.1 200
 *{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 4,
        "zone_id": 1,
        "user_id": "1",
        "type": "some type",
        "financial_damage": 1000,
        "human_damage": 1500,
        "date": "2021-07-13T12:35:34.659Z",
        "description": "some info",
        "reason": "someone was tired",
        "previous_version": null
    }
}
 * @apiParamExample {json} request-example:
 * {
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
 * @apiError (404) NotFound Zone not found.
 * @apiError (400) BadRequest Invalid date format.
 * @apiError (403) Forbidden User doesn't have access to incidents module (subscription upgrade required).
 */

const create = async (request, response) => {
    const createValidator = validator(createSchema, request.body);
    if (createValidator.failed) {
        return createValidator.response(response);
    }
    const data = {
        ...createValidator.data,
        user_id: request.user.id,
        image_ids: createValidator.data.image_ids,
        voice_ids: createValidator.data.voice_ids,
    };
    const zone = await createService.getZone(data.zone_id);
    if (zone === undefined) {
        return error(response, 404, {
            en: 'No such zone exists',
            fa: 'منطقه داده شده وجود ندارد',
        });
    }
    if (user.roles[0].name !== 'admin' && !(await 
        subscriptionService.checkByUser(user.id, 'activity', {zone_id: data.zone_id})
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
