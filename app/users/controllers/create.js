const debug = require('debug')('user:create');
const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/users create
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Create a user
 *
 * @apiParam {string} phone_number Phone number
 * @apiParam {string} first_name First name
 * @apiParam {string} last_name Last name
 *
 * @apiParamExample
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
    const { body } = request;
    const result = validator(createSchema, body);

    if (result.failed) {
        return result.response(response);
    }

    body.account_type_id = 2;
    const record = await createService.fetchUser(body.phone_number);
    if (oldUser !== undefined) {
        return error(response, 400, {
            en: 'phone number is already registered.',
        });
    }
    // const accountType = await createService.getAccountType(body.account_type_id);
    // if (accountType === undefined) {
    //     return error(response, 400, {
    //         en: 'invalid account type id',
    //     });
    // }
    
    return ok(response, {}, { en: 'user created' }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await create(request, response);
    } catch (err) {
        return next(err);
    }
};
