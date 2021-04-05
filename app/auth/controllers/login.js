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
 * @apiParam {string} phone_number Phone number
 * @apiParam {string} password Password
 *
 * @apiSuccess (200) {string} result.phone_number Phone number
 * @apiSuccess (200) {string} result.first_name First name
 * @apiSuccess (200) {string} result.last_name Last name
 * @apiSuccess (200) {string} result.token Token
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200
 * {
 *   status: 'ok',
 *   message: { en: 'Request was successful', fa: 'درخواست موفقیت آمیز بود' },
 *   result: {
 *     phone_number: '09120000000',
 *     first_name: 'first_name',
 *     last_name: 'last_name',
 *     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwMyIsImlhdCI6MTU5Nzc2NDI1MH0.nHqU0_-DHPmLcfBHEiXwe7nfpX2SjRBCr3iRhSSzO0Q'
 *   }
 * }
 *
 *
 * @apiErrorExample {json} Validation error.
 *    HTTP/1.1 422
 * @apiErrorExample {json} Invalid credentials.
 *  HTTP/1.1 400
 *   {
 *   status: 'error',
 *   message: { en: 'invalid credentials.', fa: 'درخواست موفقیت آمیز نبود!' }
 *   }
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
            en: 'invalid credentials.',
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
