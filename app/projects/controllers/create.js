const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const subscriptionService = require('../../payment/services/verify');

/**
 * @api {post} /api/projects create
 * @apiName CreateProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Create a project
 *
 * @apiParam {String} name, provided in body
 * @apiParam {Number} owner_id, provided in body
 * @apiParam {Date} start_date, acceptable format is "new Date()" provided in body
 * @apiParam {Date} scheduled_end, acceptable format is "new Date()" provided in body
 * @apiParam {String} address, provided in body
 * @apiParam {Number} area, provided in body
 * @apiParam {Boolean} is_multizoned, provided in body
 * 
 * @apiError (403) {Object} maximumProjectsReached Owner not allowed to create more projects.
 * @apiErrorExample {json} maximumMembersReached
 * HTTP/1.1 400
 *  {
 *     "status": "error",
 *     "message": {
 *          "en": "Maximum allowed projects reached.",
            "fa": "از سقف پروژه‌های مجاز عبور کرده‌اید."
 *     }
 * }
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    if (request.user.role != 'admin' && !subscriptionService.checkProjects(request.user.id)){
        return error(response, 403, {
            en: 'Maximum allowed projects reached.',
            fa: 'از سقف پروژه‌های مجاز عبور کرده‌اید.'
        });
    }
    if (!Object.prototype.hasOwnProperty.call(result.data, 'owner_id')) {
        result.data.owner_id = request.user.id;
    }
    const project = await createService(result.data);
    return ok(response, project, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
