const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const logoutSchema = require('../schemas/logout');
const logoutService = require('../services/logout');

/**
 * @api {post} /api/auth/logout Logout
 * @apiName logout
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Log out and end current session.
 *
 * @apiParam {String} refresh_token Refresh token.
 * @apiErrorExample {json} Invalid refresh token.
 *    HTTP/1.1 401
 * @apiSuccessExample {json} Success-Response
 *  HTTP/1.1 200
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    }
}
 */

const logout = async (request, response) => {
    const validationResult = validator(logoutSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const { refresh_token: refreshToken } = { ...validationResult.data };

    await logoutService(refreshToken);

    return ok(response, {});
};

module.exports = async (request, response, next) => {
    try {
        return await logout(request, response);
    } catch (err) {
        return next(err);
    }
};