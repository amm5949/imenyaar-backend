const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/projects/:id fetch
 * @apiName FetchProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Fetch a project
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {Number} owner_id
 * @apiSuccess {Date} start_date
 * @apiSuccess {Date} scheduled_end
 * @apiSuccess {String} address
 * @apiSuccess {Number} area
 * @apiSuccess {Boolean} is_multizoned
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

module.exports = async (request, response) => {
    await fetch(request, response);
};
