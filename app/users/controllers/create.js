const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/users create
 * @apiName Refer User
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Create/refer a user
 *
 * @apiParam {string} phone_number Phone number
 * @apiParam {string} first_name First name
 * @apiParam {string} last_name Last name
 *
 * @apiParamExample {json} Request-Example:
 * {
 * "phone_number": "09220000000",
    "first_name": "John",
    "last_name": "Doe"
 * }
 *
 * @apiSuccessExample {json} Success-Response
 HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
 HTTP/1.1 422
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);
    
    if (result.failed) {
        return result.response(response);
    }
    const referer_id = request.user.id;
    const body = request.body;
    body.referer_id = referer_id;
    
    const user = await createService(request.body);
    if (Object.prototype.hasOwnProperty.call(user, 'error')) {
        return error(response, 400, {
            en: 'Mobile number exists in the database.',
            fa: 'شماره موبایل قبلاً ثبت شده است.',
        });
    }
    return ok(response, {}, { en: 'user created' }, 200);
};

module.exports = async (request, response, next) => {

    return await create(request, response);
    
};
