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
	"creation_date": "2021-06-09T18:36:27.083Z",
    "activity_id": 1,
    "zone_id": 1,
    "category_id": 2,
    "answers": [
        {
            "question_id": 1,
            "option_id": 1,
            "description": "I suppose this is correct."
        },
        {
            "question_id": 5,
            "option_id": 8,
            "description": "This is somewhat correct."
        },
        
        {
            "question_id": 6,
            "option_id": 9,
            "description": "Well..."
        },        
        {
            "question_id": 7,
            "option_id": 12,
            "description": "..."
        },        
        {
            "question_id": 8,
            "option_id": 14,
            "description": ""
        }
    ]
}
 */
const create = async (request, response) => {
    const { user } = request;
    const validatorResult = validator(createSchema, request.body);
    const data = {
        ...validatorResult.data,
        user_id: user.id,
    };

    if (validatorResult.failed) {
        validatorResult.response(response);
    }

    const report = await createService(data);

    return ok(response, report);
};

module.exports = create;
