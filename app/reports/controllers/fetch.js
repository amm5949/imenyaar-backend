const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../helpers/access');

/**
 * @api {get} /api/reports/:id Get
 * @apiGroup Reports
 * @apiName GetReport
 * @apiVersion 1.0.0
 * @apiDescription Fetch a report by id. Depending on the chosen approach explained in CreateRerport api
 * regarding the use of parent_id field, this api can behave differently.
 * 1. if parent_id always refers to the first version, fetching a first-version report will always return
 * a full log, while any subsequent record version fetches will return a single version of it (no flag whether it's last version).
 * 2. if parent_id refers to previous version, fetching a first-version report will return a full log,
 * while fetching subsequent versions will return logs from that point on (a latest-version report will only return itself).
 * > For further details see `CreateReport` api.
 * 
 *
 * @apiParam (Param) id Report id
 * 
 * @apiSuccess {Array} result Array of report objects, sorted from latest submission date
 * @apiSuccess {Array} result.*.answers Answer array, includes all answers submitted in a report, is grouped into sub-arrays of answers by category.
 * @apiSuccess {String} result.*.answers.category Category name of answers in that group.
 * @apiSuccess {String} result.*.answers.*.answers Answers all in the same category, full details.
 * @apiSuccess {Array} result.*.images Images linked to a question answer, full detail.
 * @apiSuccess {Array} result.*.voices Voices linked to a question answer, full detail.
 * 
 *
 * @apiSuccessExample
HTTP/1.1 200
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 78,
            "activity_id": 1,
            "zone_id": "2",
            "user_id": "1",
            "creation_date": "2021-08-21T14:30:55.442+04:30",
            "is_deleted": false,
            "parent_id": "69",
            "correctness_percent": 0,
            "answers": [
                {
                    "category": "another cat",
                    "answers": [
                        {
                            "id": "227",
                            "description": "",
                            "question_id": "1",
                            "option_id": "2",
                            "report_id": "78",
                            "is_deleted": false,
                            "list_order": 0,
                            "title": "Lorem Ipsum?",
                            "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
                            "category_id": 2,
                            "option": "Option B",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        },
                        {
                            "id": "228",
                            "description": "",
                            "question_id": "10",
                            "option_id": "17",
                            "report_id": "78",
                            "is_deleted": false,
                            "list_order": 450,
                            "title": "Ist das eine frage?",
                            "paragraph": "Was ist die frage?",
                            "category_id": 2,
                            "option": "Antworte A",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [
                                {
                                    "id": "3",
                                    "answer_id": "228",
                                    "path": "beepbopbeep.png",
                                    "is_deleted": false
                                }
                            ],
                            "voices": []
                        }
                    ]
                },
                {
                    "category": "third cat",
                    "answers": [
                        {
                            "id": "229",
                            "description": "",
                            "question_id": "8",
                            "option_id": "14",
                            "report_id": "78",
                            "is_deleted": false,
                            "list_order": 400,
                            "title": "Lorem Ipsum?",
                            "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
                            "category_id": 3,
                            "option": "Option B",
                            "is_correct_choice": false,
                            "category": "third cat",
                            "images": [
                                {
                                    "id": "2",
                                    "answer_id": "229",
                                    "path": "mypathypathpath.jpg",
                                    "is_deleted": false
                                }
                            ],
                            "voices": []
                        }
                    ]
                }
            ]
        },
        {
            "id": 69,
            "activity_id": 1,
            "zone_id": "2",
            "user_id": "1",
            "creation_date": "2021-08-20T14:30:55.442+04:30",
            "is_deleted": false,
            "parent_id": "60",
            "correctness_percent": 0.3333333333333333,
            "answers": [
                {
                    "category": "another cat",
                    "answers": [
                        {
                            "id": "200",
                            "description": "",
                            "question_id": "1",
                            "option_id": "2",
                            "report_id": "69",
                            "is_deleted": false,
                            "list_order": 0,
                            "title": "Lorem Ipsum?",
                            "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
                            "category_id": 2,
                            "option": "Option B",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        },
                        {
                            "id": "201",
                            "description": "I suppose this is somewhat correct.",
                            "question_id": "10",
                            "option_id": "17",
                            "report_id": "69",
                            "is_deleted": false,
                            "list_order": 450,
                            "title": "Ist das eine frage?",
                            "paragraph": "Was ist die frage?",
                            "category_id": 2,
                            "option": "Antworte A",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        },
                        {
                            "id": "202",
                            "description": "",
                            "question_id": "12",
                            "option_id": "21",
                            "report_id": "69",
                            "is_deleted": false,
                            "list_order": 600,
                            "title": "Ist das meine frage?",
                            "paragraph": "",
                            "category_id": 2,
                            "option": "Antworte B",
                            "is_correct_choice": true,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        }
                    ]
                }
            ]
        },
        {
            "id": 60,
            "activity_id": 1,
            "zone_id": "2",
            "user_id": "1",
            "creation_date": "2021-06-21T14:30:55.442+04:30",
            "is_deleted": false,
            "parent_id": null,
            "correctness_percent": 0,
            "answers": [
                {
                    "category": "another cat",
                    "answers": [
                        {
                            "id": "173",
                            "description": "This is correct.",
                            "question_id": "1",
                            "option_id": "1",
                            "report_id": "60",
                            "is_deleted": false,
                            "list_order": 0,
                            "title": "Lorem Ipsum?",
                            "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
                            "category_id": 2,
                            "option": "Option A",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [
                                {
                                    "id": "4",
                                    "answer_id": "173",
                                    "path": "valleyforge.gif",
                                    "is_deleted": false
                                }
                            ],
                            "voices": []
                        },
                        {
                            "id": "174",
                            "description": "I suppose this is somewhat correct.",
                            "question_id": "10",
                            "option_id": "17",
                            "report_id": "60",
                            "is_deleted": false,
                            "list_order": 450,
                            "title": "Ist das eine frage?",
                            "paragraph": "Was ist die frage?",
                            "category_id": 2,
                            "option": "Antworte A",
                            "is_correct_choice": false,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        },
                        {
                            "id": "175",
                            "description": "",
                            "question_id": "12",
                            "option_id": "21",
                            "report_id": "60",
                            "is_deleted": false,
                            "list_order": 600,
                            "title": "Ist das meine frage?",
                            "paragraph": "",
                            "category_id": 2,
                            "option": "Antworte B",
                            "is_correct_choice": true,
                            "category": "another cat",
                            "images": [],
                            "voices": []
                        }
                    ]
                }
            ]
        }
    ]
}
 * @apiError (404) NotFound Report not found
 * @apiError (403) ForbiddenAccess Access denied.
 */
const get = async (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const report = await fetchService.fetchReport(id);
    if(!report.length){
        return error(response, 404, {
            en: 'Report not found.',
            fa: 'گزارش یافت نشد.'
        });
    }
    // Check access
    if (!(await accessCheck.byReport(user, report[0]))) {
        return error(response, 403, {
            en: 'Access to report is denied.',
            fa: 'دسترسی به گزارش وجود ندارد.'
        });
    }
    return ok(response, report);
};

module.exports = get;
