const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/subscription create
 * @apiName Create Account Subscription Type
 * @apiGroup Subscription
 * @apiVersion 1.0.0
 * @apiDescription Create a subscription schema with various filters.
 *
 * @apiParam {String} name Subscription name
 * @apiParam {Boolean} [can_add_person=False] whether project manager can refer a person (affects supervisor schema).
 * @apiParam {Integer} [activity_count=1] number of activities the manager can define.
 * @apiParam {Boolean} [can_edit_photo=False] whether the project members can edit the photo before submission (NOT report edit).
 * @apiParam {Boolean} [can_send_voice=False] whether the project members can send voice on reports or incidents.
 * @apiParam {Boolean} [can_access_incident=False] whether the project members have access to incident options (CRUD).
 * @apiParam {Boolean} [can_get_analytics=False] whether the project manager can get analytics in pdf format.
 * @apiParam {Boolean} [can_backup=False] whether the project manager can backup their project data.
 * @apiParam {Integer} [duration_days=365] duration of the subscription in days.
 * @apiParam {Integer} price the price of the subscriptio (in rials).
 * @apiParamExample {json} Request-Example:
 * {
    "name": "Gold",
	"can_add_person": false,
	"activity_count": 4,
	"can_edit_photos": true,
	"can_send_voice": true,
	"can_access_incident": true,
	"price": 10000,
	"duration": 10
}
 * @apiSuccessExample
 * HTTP/1.1 200
 * {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"id": 2,
		"name": "Gold",
		"can_add_person": false,
		"activity_count": 4,
		"can_edit_photo": false,
		"can_send_voice": true,
		"can_access_incident": true,
		"can_get_analytics": false,
		"can_backup": false,
		"duration_days": 365,
		"price": 10000
	}
}
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    const accountType = await createService(result.data);
    return ok(response, accountType, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
