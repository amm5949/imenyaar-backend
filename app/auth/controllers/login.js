/* eslint-disable max-len */
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const loginSchema = require('../schemas/login');
const loginService = require('../services/login');
/**
 * @api {post} /api/auth/login Login
 * @apiName login
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Logging in to system
 *
 * @apiParam {string{1..15}} phone_number Phone number
 * @apiParam {string} password Password
 * @apiParam {boolean} [extend_session=false] Whether session token is extended
 *
 * @apiSuccess (200) {string} result.phone_number Phone number
 * @apiSuccess (200) {string} result.first_name First name
 * @apiSuccess (200) {string} result.last_name Last name
 * @apiSuccess (200) {string} result.tokens Tokens list
 * @apiSuccess (200) {string} result.tokens.access_token Acess token
 * @apiSuccess (200) {string} result.tokens.refresh_token Refresh token
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200
 * {
 *   status: 'ok',
 *   message: {
 *      en: 'Request was successful',
 *      fa: 'درخواست موفقیت آمیز بود'
 *   },
 *   result: {
 *     phone_number: '09120000000',
 *     first_name: 'first_name',
 *     last_name: 'last_name',
 *     "tokens": {
 *       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIwODQ5NjMxfQ.SBCY4UtHyF-DzM51F3pHBr3ZuK09T-DyMcuoCgDhbaU",
 *       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0b2tlbiI6ImRjNzVjYjU0MzU4NDhlMjhmMzA5YzRiMGE0Y2RjNjRiIiwiaWF0IjoxNjIwODQ5NjMxfQ.yPxnsIJhQl-X-D3zVsl3EBsXAJ9DEzDty7KEQksXep4"
 *     }
 *   }
 * }
 *
 * @apiError (422) {Object} UnprocessableEntity Validation error
 * @apiError (400) {Object} BadRequest Invalid credentials
 * @apiErrorExample {json} Validation error.
 *    HTTP/1.1 422
 * @apiErrorExample {json} Invalid credentials.
 *  HTTP/1.1 400
 *  {
 *     "status": "error",
 *     "message": {
 *         "en": "Invalid credentials.",
 *         "fa": "اطلاعات کاربری نادرست است."
 *     }
 * }
 *
 */
const login = async (request, response) => {
    // Validate the input
    const result = validator(loginSchema, request.body);

    // Check if validation has failed
    if (result.failed) {
        return result.response(response);
    }

    // Call the service
    const user = await loginService(result.data);

    // Check the result (wrong combination/user does not exist)
    if (!user) {
        return error(response, 400, {
            en: 'Invalid credentials.',
            fa: 'اطلاعات کاربری نادرست است.',
        });
    }

    return ok(response, user);
};


module.exports = async (request, response, next) => {
    try {
        return await login(request, response);
    } catch (err) {
        return next(err);
    }
};
