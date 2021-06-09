const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/reports create
 * @apiName CreateReport
 * @apiGroup Reports
 * @apiVersion 1.0.0
 * @apiDescription Create a report
 *
 * @apiParam {Date} creation_date acceptable format is "new Date()"
 * @apiParam {Number} zone_id Zone id
 * @apiParam {Number} activity_id Activity id
 *
 * @apiParamExample
 * {
    "address": "first added question",
    "description": "some long text",
    "start_date": "",
    "end_date": "",
    "category_id": "2",
    "answers": [
        {
            "question_id": 4,
            "option_id": 1,
            "description": "somsmo"
        },
        {
            "question_id": 5,
            "option_id": 4,
            "description": "descriptiondescriptiondescription"
        }
    ]
}
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    result = {
        ...result.data,
        user_id: request.user.id,
    }
    const report = await createService(result.data);
    return ok(response, report, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
