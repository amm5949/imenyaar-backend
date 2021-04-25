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
    const project = await fetchService.fetch_project(id);
    if (!project) {
        return error(response, 404, {
            en: 'Project not found.',
            fa: 'پروژه یافت نشد.',
        });
    }
    return ok(response, project, { }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await fetch(request, response);
    } catch (err) {
        return next(err);
    }
};
