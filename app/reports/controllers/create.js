const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const activityService = require('../../activities/services/fetch');
const accessHelper = require('../helpers/access');

/**
 * @api {post} /api/reports create
 * @apiName CreateReport
 * @apiGroup Reports
 * @apiVersion 1.0.0
 * @apiDescription Create a report, note that this creates a 'parent' i.e. new report,
 * if you want to update a report, use `update` api to create a new report record while
 * saving the parent. To update a record, you can use two approaches (up to front dev, but stick with one):
 * 1. link every subsequent update to the original report
 * 2. link every subsequent update to its previous version 
 * 
 * Regardless of approach, you can get all logs by fetching the original id,
 * however, with the second approach, calling fetch on the id of updated records
 * will give you its subsequent updates, while the first approach will give you single
 * records unless you call the original (parent/first) version of the report.
 * > See `GetReport` for further details.
 *
 * @apiParam {String} creation_date Creation date, format is `new Date()` in js.
 * @apiParam {Number} zone_id Zone id
 * @apiParam {Number} activity_id Activity id
 * @apiParam {Number} answers.*.question_id Question id
 * @apiParam {Number} answers.*.option_id Chosen option id
 * @apiParam {String} answers.*.description Answer description
 * @apiParam {Array} answers.*.image_ids Linked image ids per answer
 * @apiParam {Array} answers.*.voice_ids Linked voice ids per answer
 *
 * @apiParamExample
 * {
	"creation_date": "2021-06-11T14:30:55.442+04:30",
    "activity_id": 1,
    "zone_id": 2,
    "answers": [
        {
            "question_id": 1,
            "option_id": 1,
            "description": "This is correct.",
            "image_ids": [2, 4],
            "voice_ids": []
        },
        {
            "question_id": 10,
            "option_id": 17,
            "description": "Something more or less descriptive.",
            "image_ids": [3],
            "voice_ids": []
        },
        
        {
            "question_id": 12,
            "option_id": 21,
            "description": "",
            "image_ids": [],
            "voice_ids": []
        }
    ]
}
 * @apiSuccess {Object} result.report  Report details
 * @apiSuccess {Array} result.answers  Array of answer details (image and voice lins not included)
 * 
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
            "id": 60,
            "activity_id": 1,
            "zone_id": "2",
            "user_id": "1",
            "creation_date": "2021-06-11T14:30:55.442+04:30",
            "is_deleted": false,
            "parent_id": null
        },
        "answers": [
            {
                "id": "173",
                "description": "This is correct.",
                "question_id": "1",
                "option_id": "1",
                "report_id": "60",
                "is_deleted": false
            },
            {
                "id": "174",
                "description": "Something more or less descriptive.",
                "question_id": "10",
                "option_id": "17",
                "report_id": "60",
                "is_deleted": false
            },
            {
                "id": "175",
                "description": "",
                "question_id": "12",
                "option_id": "21",
                "report_id": "60",
                "is_deleted": false
            }
        ]
    }
}

 * @apiError (403) ForbiddenAccess invalid access
 * @apiErrorExample {json} ForbiddenAccess
 * HTTP/1.1 403
 *  {
 *     "status": "error",
 *     "message": {
 *        "en": "Invalid access",
        "fa": "دسترسی غیرمجاز"
 *     }
 * }
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
    // TODO: add this when access check is fixed
    const activity = await activityService.fetch_activity(data.activity_id);
    if (!accessHelper.byActivity(user, activity)){
        return error(response, 403, {
            en: 'Invalid access',
            fa: 'دسترسی غیرمجاز'
        });
    }

    const report = await createService(data);
    return ok(response, report);
};

module.exports = create;
