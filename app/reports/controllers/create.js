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
 * @apiParam {String} creation_date Creation date, format is `new Date()` in js.
 * @apiParam {Number} zone_id Zone id
 * @apiParam {Number} activity_id Activity id
 * @apiParam {Number} answers.*.question_id Question id
 * @apiParam {Number} answers.*.option_id Chosen option id
 * @apiParam {String} answers.*.description Answer description
 *
 * @apiParamExample
 * {
	"creation_date": "2021-06-11T18:30:55.442+04:30",
    "activity_id": 1,
    "zone_id": 1,
    "answers": [
        {
            "question_id": 1,
            "option_id": 1,
            "description": ""
        },
        {
            "question_id": 10,
            "option_id": 17,
            "description": "For these reasons."
        },
        
        {
            "question_id": 12,
            "option_id": 21,
            "description": ""
        }
    ]
}
 * @apiSuccessExample 
    HTTP/1.1 200 
    {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "report": {
            "id": 23,
            "activity_id": 1,
            "zone_id": "1",
            "user_id": "1",
            "creation_date": "2021-06-11T18:30:55.442+04:30",
            "is_deleted": false
        },
        "answers": [
            {
                "id": "71",
                "description": "",
                "question_id": "1",
                "option_id": "1",
                "report_id": "23",
                "is_deleted": false
            },
            {
                "id": "72",
                "description": "For these reasons.",
                "question_id": "10",
                "option_id": "17",
                "report_id": "23",
                "is_deleted": false
            },
            {
                "id": "73",
                "description": "",
                "question_id": "12",
                "option_id": "21",
                "report_id": "23",
                "is_deleted": false
            }
        ]
    }
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
