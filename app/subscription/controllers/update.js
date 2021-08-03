const { ok, error } = require('../../../core/util/response');
const validator = require('../../../core/util/validator');
const updateSchema = require('../schemas/update');
const updateService = require('../services/update');
const fetchService = require('../services/fetch');

/**
 * @api {put} /api/subscriptions/types/:id Update
 * @apiGroup Subscriptions
 * @apiName Update Account Subscription Type
 * @apiVersion 1.0.0
 * @apiDescription Update subscription type schema. 
 * This does not affect already existing subscription costs or durations.
 * However, the subscription features will be updated for all user with an active subscription of this type.
 * Use this API with great care (especially regarding quantitive modules such as activity limit).
 * @apiPermission admin
 * 
 * @apiParam (Path param) {number} id Id
 * @apiParam {String} [name] Subscription name
 * @apiParam {Boolean} [can_add_person=False] whether project manager can refer a person (affects supervisor schema).
 * @apiParam {Integer} [activity_count=1] number of activities the manager can define.
 * @apiParam {Boolean} [can_edit_photo=False] whether the project members can edit the photo before submission (NOT report edit).
 * @apiParam {Boolean} [can_send_voice=False] whether the project members can send voice on reports or incidents.
 * @apiParam {Boolean} [can_access_incident=False] whether the project members have access to incident options (CRUD).
 * @apiParam {Boolean} [can_get_analytics=False] whether the project manager can get analytics in pdf format.
 * @apiParam {Boolean} [can_backup=False] whether the project manager can backup their project data.
 * @apiParam {Integer} [duration_days=365] duration of the subscription in days.
 * @apiParam {Integer} [price] the price of the subscriptio (in tomans).
 * @apiParamExample {json} Request-Example:
 * {
	"activity_count": 6,
	"can_edit_photos": true,
	"can_send_voice": false,
	"can_access_incident": true,
	"price": 300000
}
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": [
		{
			"id": 2,
			"name": "Gold",
			"can_add_person": false,
			"activity_count": 6,
			"can_edit_photo": true,
			"can_send_voice": false,
			"can_access_incident": true,
			"can_get_analytics": false,
			"can_backup": false,
			"duration_days": 365,
			"price": 300000
		}
	]
}
 * @apiError (404) NotFound Subscription type not found.
 */

module.exports = async (request, response) => {
    const { id } = request.params;
    const result = validator(updateSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    if (!(await fetchService(id))) {
        return error(response, 404, {
            en: 'Account subscription type not found.',
            fa: 'نوع اشتراک کاربری یافت نشد.',
        });
    }
    const record = await updateService(result.data, id);
    return ok(response, record, {}, 200);
};
