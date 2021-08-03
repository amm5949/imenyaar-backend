const activateSchema = require('../schemas/activate');
const validator = require('../../../core/util/validator');
const actiateService = require('../services/activate');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {post} /api/auth/activate Activate
 * @apiName Activate Account
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Activates an account.
 *
 * @apiParam {string} phone_number Phone number
 * @apiParam {string} code Code
 * 
 * @apiParamExample {json} Request-Example:
 * {
 * "phone_number": "09220000000",
    "code": "b4c402ca"
 * }
 *
 * @apiSuccessExample {json} Success-Response
HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
HTTP/1.1 422
 * @apiErrorExample {json} Invalid code.
HTTP/1.1 400
 *
 */

const activate = async (request, response) => {
    const validationResult = validator(activateSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const activationResult = await actiateService(request.body);

    if (!activationResult) {
        return error(response, 400, {
            en: 'Invalid code.',
            fa: 'کد نامعتبر است.',
        });
    }

    return ok(response, {});
};

module.exports = async (request, response, next) => {
    try {
        return await activate(request, response);
    } catch (err) {
        return next(err);
    }
};
