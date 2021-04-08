const listService = require('../services/list');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/users list
 * @apiName ListUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription List all users, output format is same as FetchUsers but users are in an array
 * @apiSuccess {Number} id
 * @apiSuccess {String} phone_number
 * @apiSuccess {String} last_name
 * @apiSuccess {String} first_name
 * @apiSuccess {Number} account_type_id
 * @apiSuccess {Boolean} is_active
 * @apiSuccess {Boolean} is_verified
 *
 */

const list = async (request, response) => {
    const users = await listService.fetchUsers();
    return ok(response, users, {}, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await list(request, response);
    } catch (err) {
        return next(err);
    }
};
