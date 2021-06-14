const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/activities create
 * @apiName CreateActivity
 * @apiGroup Activity
 * @apiVersion 1.0.0
 * @apiDescription Create an Activity
 *
 * @apiParam {Number} person_id if not provided, id of requesting user will be used 
 * @apiParam {string} status 
 * @apiParam {Date} start_date acceptable format is "new Date()" 
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()"
 *
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    if (!Object.prototype.hasOwnProperty.call(result.data, 'person_id')) {
        result.data.person_id = request.user.id;
    }
    const project = await createService(result.data);
    return ok(response, project, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
