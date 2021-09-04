const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/update');

/**
 * @api {put} /api/users/:id Update
 * @apiName Update User
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Updates a user
 *
 * @apiParam (parameter) {int} id user id
 * @apiParam (body) {string} [first_name] first name
 * @apiParam (body) {string} [last_name] last name
 * @apiParam (body) {string} [phone_number] available to non-verified users (by referer)
 * @apiParam (body) {string} [password] available only to user
 *
 * @apiParamExample {json} Request-Example
{
    "first_name": "John",
    "last_name": "Doe"
}
 *
 * @apiSuccessExample {json} Success-Response
 HTTP/1.1 200
 {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {}
}
 * @apiErrorExample {json} Access denied.
 HTTP/1.1 401
 {
    "status": "error",
    "message": {
        "en": "Access denied.",
        "fa": "دسترسی غیر مجاز"
    }
}
 * @apiErrorExample {json} Validation error.
 HTTP/1.1 422
 */

const update = async (request, response) => {
    const id = request.params.id;
    const user_id = request.user.id;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    const user = await updateService.fetchUser(id);

    if (user === undefined) {
        return error(response, 404, {
            en: 'User not found',
            fa: 'کاربر یافت نشد.'
        });
    }
    
    if (user.id != user_id 
        && (user_id != user.referer_id
            || (
                user_id == user.referer_id
                && Object.prototype.hasOwnProperty.call(data, 'password')
            )
            || (
                user.is_verified == true
                && Object.prototype.hasOwnProperty.call(data, 'phone_number')
            )    
        )){
        return error (response, 401,
            {
                en: 'Access denied.',
                fa: 'دسترسی غیر مجاز',
            }
        );
    }

    const updatedUser = await updateService.updateUser(id, data);

    return ok(response, {}, {}, 200);
};

module.exports = async (request, response, next) => {
    return await update(request, response);
};
