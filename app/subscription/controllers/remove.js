const { ok, error } = require('../../../core/util/response');
const validator = require('../../../core/util/validator');
const removeService = require('../services/remove');
const fetchService = require('../services/fetch');

/**
 * @api {delete} /api/subscriptions/types/:id remove
 * @apiGroup Subscriptions
 * @apiName Remove Account Subscription Type
 * @apiVersion 1.0.0
 * @apiDescription Remove subscription type schema. 
 * This will only work if there are *no* subscriptions of this type on the server,
 *  active, expired, or otherwise.
 * @apiPermission admin
 * 
 * @apiParam (Path param) {number} id Id
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
			"id": 8,
			"name": "bronze",
			"can_add_person": false,
			"activity_count": 1,
			"can_edit_photo": false,
			"can_send_voice": false,
			"can_access_incident": false,
			"can_get_analytics": false,
			"can_backup": false,
			"duration_days": 365,
			"price": 500
		}
	]
}
 * @apiError (404) NotFound Subscription type not found.
 * @apiError (400) BadRequest Subscription type cannot be deleted (in use).
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 BadRequest
 * {
	"status": "error",
	"message": {
		"en": "You cannot delete this account type.",
		"fa": "شما نمی‌توانید این نوع اشتراک را حذف کنید."
	}
}
 */

module.exports = async (request, response) => {
    const { id } = request.params;
    if (!(await fetchService(id))) {
        return error(response, 404, {
            en: 'Account subscription type not found.',
            fa: 'نوع اشتراک کاربری یافت نشد.',
        });
    }
    const record = await removeService(id);
    if (record === undefined || record.hasOwnProperty('error')){
        return error(response, 400, {
            en: 'You cannot delete this account type.',
            fa: 'شما نمی‌توانید این نوع اشتراک را حذف کنید.',
        });
    }
    return ok(response, record.rows, {}, 200);
};
