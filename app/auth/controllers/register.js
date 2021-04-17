const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const registerSchema = require('../schemas/register');
const registerService = require('../services/register');
/**
 * @api {post} /api/auth/register Register
 * @apiName register
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Register a user.
 *
 * @apiParam {string{1..15}} phone_number Phone number
 * @apiParam {string{6..}} password Password
 * @apiParam {string} first_name First name
 * @apiParam {string} last_name Last name
 * 
 * @apiParamExample
 * {
    "phone_number": "0922000000",
    "password": "password",
    "first_name": "John",
    "last_name": "Doe"
}
 *
 * @apiSuccessExample {json} Success-Response
HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
HTTP/1.1 422
 * @apiErrorExample {json} Duplicate phone number.
HTTP/1.1 400
{
    "status": "error",
    "message": {
        "en": "Mobile number exists in the database.",
        "fa": "شماره موبایل قبلاً ثبت شده است."
    }
}
 *
 */
const register = async (request, response) => {
    const validationResult = validator(registerSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const data = { ...validationResult.data };

    const user = await registerService(data);
    if (Object.prototype.hasOwnProperty.call(user, 'error')) {
        return error(response, 400, {
            en: 'Mobile number exists in the database.',
            fa: 'شماره موبایل قبلاً ثبت شده است.',
        });
    }

    return ok(response, {});
};

module.exports = async (request, response, next) => {
    try {
        return await register(request, response);
    } catch (err) {
        return next(err);
    }
};
