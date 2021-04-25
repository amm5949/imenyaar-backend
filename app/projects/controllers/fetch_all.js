const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/users list
 * @apiName ListUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription List all users, output format is same as FetchUsers but users are in an array
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
 *
 */

const list = async (request, response) => {
    const projects = await listService.fetch_projects(request.query);
    return ok(response, projects, {}, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await list(request, response);
    } catch (err) {
        return next(err);
    }
};
