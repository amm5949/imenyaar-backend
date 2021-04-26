const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

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
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }

    const project = await createService(request.body);
    return ok(response, project, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
