const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/subscription/types/:id fetch
 * @apiName Fetch Account Subscription Type
 * @apiGroup Subscription
 * @apiVersion 1.0.0
 * @apiDescription Return the subscription schema details.
 *
 * @apiSuccess {Integer} id Subscription type id
 * @apiSuccess {String} name Subscription type name
 * @apiSuccess {Boolean} can_add_person whether project manager can refer a person (affects supervisor schema).
 * @apiSuccess {Integer} activity_count number of activities the manager can define.
 * @apiSuccess {Boolean} can_edit_photo whether the project members can edit the photo before submission (NOT report edit).
 * @apiSuccess {Boolean} can_send_voice whether the project members can send voice on reports or incidents.
 * @apiSuccess {Boolean} can_access_incident whether the project members have access to incident options (CRUD).
 * @apiSuccess {Boolean} can_get_analytics whether the project manager can get analytics in pdf format.
 * @apiSuccess {Boolean} can_backup whether the project manager can backup their project data.
 * @apiSuccess {Integer} duration_days duration of the subscription in days.
 * @apiSuccess {Integer} price the price of the subscriptio (in rials).
 * @apiSuccessExample
 * HTTP/1.1 200
 * {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"id": 1,
		"name": "Silver",
		"can_add_person": false,
		"activity_count": 1,
		"can_edit_photo": false,
		"can_send_voice": false,
		"can_access_incident": false,
		"can_get_analytics": false,
		"can_backup": false,
		"duration_days": 365,
		"price": 10000
	}
 * }
 * @apiError (404) NotFound Account type not found.
 * @apiErrorExample
 * HTTP/1.1 404 Not Found
 * {
	"status": "error",
	"message": {
		"en": "Account subscription type not found.",
		"fa": "مدل اشتراک یافت نشد."
	}
 * }
 */

const create = async (request, response) => {
    const { id } = request.params;
    const accountType = await fetchService(id);
    if (accountType === undefined){
        return error(response, 404, {
            en: 'Account subscription type not found.',
            fa: 'مدل اشتراک یافت نشد.'
        });
    }
    return ok(response, accountType, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
