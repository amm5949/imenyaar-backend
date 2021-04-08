const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const {
    ok,
    error
} = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {put} /api/users Update
 * @apiName UpdateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Update a user
 *
 * @apiParam {string} first_name First name
 * @apiParam {string} last_name Last name
 * @apiParam {Number} account_type_id Account type id
 *
 * @apiParamExample
 * {
    "first_name": "Abbas",
    "last_name": "Mohammadzadeh",
    "account_type_id": 2
 * }
 *
 * @apiSuccessExample {json} Success-Response
 HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
 HTTP/1.1 422
 */

const update = async (request, response) => {
    const id = request.params;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const user = await updateService.fetchUser(id);
    if (!user) {
        return error(response, 404, {
            en: 'user not found',
        });
    }
    const data = {
        last_name: request.body.last_name || user.last_name,
        first_name: request.body.first_name || user.first_name,
        account_type_id: request.account_type_id || user.account_type_id,
    };
    if (request.body.account_type_id) {
        if (!(await updateService.getAccountType(request.body.account_type_id))) {
            return error(response, 400, {
                en: 'invalid account type id',
            });
        }
    }
    const updatedUser = await updateService.updateUser(id, data);
    return ok(response, updatedUser, { en: 'user created' }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await update(request, response);
    } catch (err) {
        return next(err);
    }
};
