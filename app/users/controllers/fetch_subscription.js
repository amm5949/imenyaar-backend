const fetchService = require('../services/fetch');
const subscriptionFetchService = require('../services/fetch_subscription');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/users/:id/subscription fetch active subscription
 * @apiName Fetch Active User Subscription
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Fetch a user's subscription info. Note that this API is for the
 * currently active subscription and not the user's past/future subscriptions. For that purpose,
 * the fetch user API should be used.
 * This API is best used to check whether user has access to certain limited modules, those modules
 * with an endpoint do a double-check upon such requests, but this API is for pre-checking and rendering.
 * If `result` is empty, the user has no active subscription.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"id": 23,
		"name": "Gold",
		"can_add_person": false,
		"activity_count": 4,
		"can_edit_photo": false,
		"can_send_voice": true,
		"can_access_incident": true,
		"can_get_analytics": false,
		"can_backup": false,
		"duration_days": 365,
		"price": 30000,
		"start_date": "2021-08-03T17:48:02.241Z",
		"end_date": "2022-08-03T17:48:02.241Z"
	}
}
 * 
 * @apiError (404) NotFound User not found.
 * @apiError (403) Forbidden Access forbidden.
 * 
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    const user = await fetchService.fetchUser(id);
    if (!user) {
        return error(response, 404, {
            en: 'User not found.',
            fa: 'کاربر یافت نشد.',
        });
    }
    if (user.id !== request.user.id && request.user.roles[0].name !== 'admin') {
        return error(response, 403, {
            en: 'Forbidden access.', 
            fa: 'دسترسی مجاز نیست.',
        });
    }
    const subscription = await subscriptionFetchService(id);
    return ok(response, subscription, { }, 200);
};

module.exports = async (request, response) => {
    return await fetch(request, response);
};
