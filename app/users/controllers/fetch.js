const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/users/:id fetch
 * @apiName FetchUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Fetch a user
 * @apiSuccess {Number} id
 * @apiSuccess {String} phone_number
 * @apiSuccess {String} last_name
 * @apiSuccess {String} first_name
 * @apiSuccess {Number} account_type_id
 * @apiSuccess {Boolean} is_active
 * @apiSuccess {Boolean} is_verified
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    const user = await fetchService.fetchUser(id);
    if (!user) {
        return error(response, 404, {
            en: 'User not found.',
            fa: 'کاربر یافت نشد.',
        });
    }
    return ok(response, user, { }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await fetch(request, response);
    } catch (err) {
        return next(err);
    }
};
