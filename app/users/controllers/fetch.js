const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/users/:id fetch
 * @apiName Fetch User
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Fetch a user
 * @apiSuccess {Object} result.user User information
 * @apiSuccess {Array} [result.subscriptions] User subscription information 
 *                                           (only if user is admin or request themselves)
 * @apiSuccessExample {json} Success-Response (for users with full access):
 * HTTP/1.1 200 OK
 * 	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"user": {
			"id": 12,
			"phone_number": "09111234567",
			"first_name": "Tuesday",
			"last_name": "Weld",
			"is_active": true,
			"is_verified": true
		},
		"subscriptions": [
			{
				"id": 25,
				"user_id": 12,
				"account_type_id": 1,
				"start_date": "2022-08-03T17:48:02.241Z",
				"end_date": "2023-08-03T17:49:10.559Z",
				"cost": 10000,
				"is_verified": true,
				"authority": "000000000000000000000000000000571822"
			},
			{
				"id": 23,
				"user_id": 12,
				"account_type_id": 2,
				"start_date": "2021-08-03T17:48:02.241Z",
				"end_date": "2022-08-03T17:48:02.241Z",
				"cost": 10000,
				"is_verified": true,
				"authority": "000000000000000000000000000000571819"
			}
		]
	}
}
 * @apiSuccessExample {json} Success-Response (for users without access):
 * HTTP/1.1 200 OK
 * 
 *        
 *  
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    let hasAccess = (request.user.id === id || request.user.roles[0].name ==='admin');
    const res = await fetchService.fetchUser(id, hasAccess);
    if (!res) {
        return error(response, 404, {
            en: 'User not found.',
            fa: 'کاربر یافت نشد.',
        });
    }
    return ok(response, res, {}, 200);
};

module.exports = async (request, response, ) => {
    return await fetch(request, response);
};
