const listService = require('../services/list');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/users list
 * @apiName ListUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription List all users. For filtering (simple search) options see
 * https://www.postgresqltutorial.com/postgresql-like/ to pass strings. Using filter
 * param will pass the string to a `LIKE` operator.
 * Filters search within role names, first/last names and phone numbers.
 * 
 * @apiParam (Query String) [filter=null] Optional string to filter usernames.
 * @apiSuccessExample
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "09150000000",
            "account_type_id": 1,
            "role": "admin",
            "is_verified": true
        }
    ]
    }
 */

const list = async (request, response) => {
    const { filter } = request.query;
    const users = await listService.fetchUsers(filter);
    return ok(response, users, {}, 200);
};

module.exports = list;
