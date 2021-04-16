const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/update');

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
    const { id } = request.params;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    const user = await updateService.fetchUser(id);
    if (user === undefined) {
        return error(response, 404, {
            en: 'user not found',
        });
    }
    if (data.account_type_id) {
        const accountType = await updateService.getAccountType(request.body.account_type_id);
        if (accountType === undefined) {
            return error(response, 400, {
                en: 'invalid account type id',
            });
        }
    }
    const updateData = {
        last_name: data.last_name || user.last_name,
        first_name: data.first_name || user.first_name,
        account_type_id: data.account_type_id || user.account_type_id,
        password: data.password || undefined,
    };
    if (user.id !== request.user.id && request.user.role !== 'admin') {
        return error(response, 401, { en: 'Unauthorized' });
    }
    const updatedUser = await updateService.updateUser(id, updateData);
    delete updatedUser.password;
    delete updatedUser.is_verified;
    delete updatedUser.is_active;
    delete updatedUser.is_deleted;
    return ok(response, updatedUser, { en: 'user created' }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await update(request, response);
    } catch (err) {
        return next(err);
    }
};
