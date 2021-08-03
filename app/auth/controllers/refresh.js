const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const refreshSchema = require('../schemas/refresh');
const refreshService = require('../services/refresh');

/**
 * @api {post} /api/auth/refresh-token Refresh Token
 * @apiName refresh-token
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Get a new pair of tokens. *Refresh token* is a single-use token that can be used to get a new pair, has longer life time.
 * *Access token* is a token that can be used to access the API's, it has 60 seconds life time. Don't use refresh token for API's.
 *
 * @apiParam {String} refresh_token Refresh token.
 * @apiSuccess {string} access_token Access token
 * @apiSuccess {string} refresh_token Refresh token
 * @apiErrorExample {json} Invalid refresh token.
 *    HTTP/1.1 401
 * @apiSuccessExample {json} Success-Response
 *  HTTP/1.1 200
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE2MjA4NTE3MTQsImlhdCI6MTYyMDg1MTY1NH0.oPaODGIeygjy-7BST6YEiiXNHiME_So6fbr3-8NxGA8",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ0b2tlbiI6IjY4YjgxMDlkMGFiOGEzYzMzMWMzMDZlOWNkOWRhODI0IiwiZXhwIjoxNjUyMzg3NjU0LCJpYXQiOjE2MjA4NTE2NTR9.70MZ4mWbZ4ZlUODDxrPjyjYNoX8Afi2GJ52zIq1JA48"
    }
}
 */

const refresh = async (request, response) => {
    const validationResult = validator(refreshSchema, request.body);

    if (validationResult.failed) {
        return validationResult.response(response);
    }

    const { refresh_token: refreshToken } = { ...validationResult.data };

    const { tokens, err } = await refreshService(refreshToken);

    if (err) {
        return error(response, 401, {
            en: 'Refresh token is invalid',
            fa: 'توکن نامعتبر است.',
        });
    }

    return ok(response, tokens);
};

module.exports = async (request, response, next) => {
    try {
        return await refresh(request, response);
    } catch (err) {
        return next(err);
    }
};
