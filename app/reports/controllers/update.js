const updateService = require('../services/update');
const fetchService = require('../services/fetch');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const updateSchema = require('../schemas/update');

/**
 * @api {put} /api/reports/:id update
 * @apiName updateReport
 * @apiGroup Reports
 * @apiVersion 1.0.0
 * @apiDescription Update a report (creates a new record and links to the first version,
 * you can re-link the previous files to the new version to keep them on the latest report,
 * or don't include to leave them on a previously linked version -- essentially deleting them but keeping them on log.)
 *
 * @apiParam {String} creation_date Creation date, format is `new Date()` in js.
 * @apiParam {Number} zone_id Zone id
 * @apiParam {Number} activity_id Activity id
 * @apiParam {Number} answers.*.question_id Question id
 * @apiParam {Number} answers.*.option_id Chosen option id
 * @apiParam {String} answers.*.description Answer description
 * @apiParam {Array} answers.*.image_ids Linked image ids
 * @apiParam {Array} answers.*.voice_ids Linked voice ids
 *
 * @apiParamExample
 * {
	"creation_date": "2021-07-21T14:30:55.442+04:30",
    "activity_id": 1,
    "zone_id": 2,
    "answers": [
        {
            "question_id": 1,
            "option_id": 2,
            "description": "",
            "image_ids": [],
            "voice_ids": [1]
        },
        {
            "question_id": 10,
            "option_id": 16,
            "description": "Some new description",
            "image_ids": [3, 2],
            "voice_ids": [6]
        },
        
        {
            "question_id": 12,
            "option_id": 21,
            "description": "",
            "image_ids": [56],
            "voice_ids": []
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
            "id": 77,
            "activity_id": 1,
            "zone_id": "2",
            "user_id": "1",
            "creation_date": "2021-07-21T14:30:55.442+04:30",
            "is_deleted": false,
            "parent_id": "76",
            "correctness_percent": 0.3333333333333333
        },
        "answers": [
            {
                "id": "224",
                "description": "",
                "question_id": "1",
                "option_id": "2",
                "report_id": "77",
                "is_deleted": false
            },
            {
                "id": "225",
                "description": "Some new description",
                "question_id": "10",
                "option_id": "16",
                "report_id": "77",
                "is_deleted": false
            },
            {
                "id": "226",
                "description": "",
                "question_id": "12",
                "option_id": "21",
                "report_id": "77",
                "is_deleted": false
            }
        ]
    }
}

 * @apiError (404) NotFound parent report not found
 * @apiErrorExample {json} NotFound
 * HTTP/1.1 404
 * {
    "status": "error",
    "message": {
        "en": "Report not found.",
        "fa": "گزارش یافت نشد."
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


const update = async (request, response) => {
    const { user } = request;
    const id = request.params.id;
    const validatorResult = validator(updateSchema, request.body);
    const data = {
        ...validatorResult.data,
        user_id: user.id,
    };

    if (validatorResult.failed) {
        validatorResult.response(response);
    }
    const previous_report = await fetchService.fetchReportById(id);
    if(previous_report === undefined){
        return error(response, 403, {
            en: 'Report not found.',
            fa: 'گزارش یافت نشد.'
        });
    }
    
    if (previous_report.user_id != user.id){
        return error(response, 403, {
            en: 'Invalid access',
            fa: 'دسترسی غیرمجاز'
        });
    }

    const report = await updateService(data, id);
    return ok(response, report);
};

module.exports = update;
