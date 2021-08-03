const newCodeSchema = require('../schemas/newCode');
const validator = require('../../../core/util/validator');
const newCodeService = require('../services/newCode');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {post} /api/auth/new-code New code
 * @apiName New Activation Code
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Requests a new code for activation.
 *
 * @apiParam {string} phone_number Phone number
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *      "phone_number": "0922000000"
 * }
 *
 * @apiSuccessExample {json} Success-Response
HTTP/1.1 200
 * @apiErrorExample {json} Validation error.
HTTP/1.1 422
 * @apiErrorExample {json} Cannot generate a new code.
    HTTP/1.1 400
    {
        "status": "error",
        "message": {
            "en": "You can't request a new code.",
            "fa": "شما نمی توانید درخواست کد جدید بدهید."
        }
    }
 *
 */

const activate = async (request, response) => {
    const validationResult = validator(newCodeSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const newCode = await newCodeService(validationResult.data);

    if (!newCode) {
        return error(response, 400, {
            en: 'You can\'t request a new code.',
            fa: 'شما نمی توانید درخواست کد جدید بدهید.',
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
