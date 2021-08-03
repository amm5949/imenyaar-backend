/* eslint-disable camelcase */
const updateService = require('../services/update');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/update');
const accessCheck = require('../services/accessCheck.js');
/**
 * @api {put} /api/projects/:id Update
 * @apiName Update Project
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Update a project
 *
 * @apiParam {String} name, provided in body
 * @apiParam {Number} owner_id, provided in body
 * @apiParam {Date} start_date, acceptable format is "new Date()" provided in body
 * @apiParam {Date} scheduled_end, acceptable format is "new Date()" provided in body
 * @apiParam {String} address, provided in body
 * @apiParam {Number} area, provided in body
 * @apiParam {Boolean} is_multizoned, provided in body
 *
 *
 */

const update = async (request, response) => {
    const { id } = request.params;
    const result = validator(createSchema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    if (!(await accessCheck(request.user, id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    const { data } = result;
    const project = await updateService.fetch_project(id);
    if (project === undefined) {
        return error(response, 404, {
            en: 'project not found',
        });
    }
    if (Object.keys(data).length === 0) {
        return error(response, 400, {
            en: 'No updates were provided.',
        });
    }
    const updated_project = await updateService.update_project(id, data);
    delete updated_project.is_deleted;
    return ok(response, updated_project, { en: 'project updated' }, 200);
};

module.exports = async (request, response) => {
    await update(request, response);
};
