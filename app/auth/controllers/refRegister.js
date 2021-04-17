const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const refRegisterSchema = require('../schemas/refRegister');
const refRegisterService = require('../services/refRegister');
/**
 * @api {post} /api/auth/ref_register RefRegister
 * @apiName refRegister
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Register a refree.
 *
 * @apiParam {string{1..15}} phone_number Phone number
 * @apiParam {string{6..}} password Password
 *
 * @apiParamExample
 * {
    "phone_number": "0922000000",
    "password": "password"
}
 *
 * @apiSuccessExample {json} Success-Response
HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
HTTP/1.1 422
 * @apiErrorExample {json} Invalid phone number.
HTTP/1.1 400
{
    "status": "error",
    "message": {
        "en": "Mobile number not found in database.",
        "fa": "شماره موبایل در سیستم ثبت نشده است."
    }
}
 * @apiErrorExample {json} Duplicate phone number.
HTTP/1.1 400
{
    "status": "error",
    "message": {
        "en": "Mobile number has already been activated.",
        "fa": "شماره موبایل قبلاً فعال شده ‌است."
    }
}
 *
 */
const register = async (request, response) => {
    const validationResult = validator(refRegisterSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const data = { ...validationResult.data };

    const user = await refRegisterService(data);
    if (Object.prototype.hasOwnProperty.call(user, 'duplicate')) {
        return error(response, 400, {
            en: 'Mobile number has already been activated.',
            fa: 'شماره موبایل قبلاً فعال شده ‌است.',
        });
    }
    if (Object.prototype.hasOwnProperty.call(user, 'unknown')) {
        return error(response, 400, {
            en: 'Mobile number not found in database.',
            fa: 'شماره موبایل در سیستم ثبت نشده است.',
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
