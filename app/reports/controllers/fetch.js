const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../helpers/access');

/**
 * @api {get} /api/reports/:id Get
 * @apiGroup Reports
 * @apiName GetReport
 * @apiVersion 1.0.0
 *
 * @apiParam (Param) id Report id
 *
 *
 * @apiSuccessExample
HTTP/1.1 200
{
    {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 3,
        "activity_id": 1,
        "zone_id": "1",
        "user_id": "1",
        "creation_date": "2021-06-08T19:30:00.000Z",
        "is_deleted": false,
        "category_id": null,
        "first_name": "Afarin",
        "last_name": "Zamanian",
        "answers": [
            {
                "category": "another cat",
                "answers": [
                    {
                        "id": "7",
                        "description": "",
                        "question_id": "1",
                        "option_id": "1",
                        "report_id": "3",
                        "is_deleted": false,
                        "list_order": 0,
                        "title": "Lorem Ipsum?",
                        "paragraph": "adipiscing elit",
                        "category_id": 2,
                        "option": "Option A",
                        "is_correct_choice": false,
                        "category": "another cat",
                        "images": [],
                        "voices": []
                    },
                    {
                        "id": "9",
                        "description": "Well...",
                        "question_id": "6",
                        "option_id": "9",
                        "report_id": "3",
                        "is_deleted": false,
                        "list_order": 400,
                        "title": "آیا این سوال است؟",
                        "paragraph": "",
                        "category_id": 2,
                        "option": "گزینه الف",
                        "is_correct_choice": false,
                        "category": "another cat",
                        "images": [],
                        "voices": []
                    },
                    {
                        "id": "8",
                        "description": "somewhat correct.",
                        "question_id": "5",
                        "option_id": "8",
                        "report_id": "3",
                        "is_deleted": false,
                        "list_order": 2100,
                        "title": "آیا این سوال است؟",
                        "paragraph": "",
                        "category_id": 2,
                        "option": "گزینه ب",
                        "is_correct_choice": false,
                        "category": "another cat",
                        "images": [],
                        "voices": []
                    }
                ]
            },
            {
                "category": "third cat",
                "answers": [
                    {
                        "id": "11",
                        "description": "",
                        "question_id": "8",
                        "option_id": "14",
                        "report_id": "3",
                        "is_deleted": false,
                        "list_order": 400,
                        "title": "Lorem Ipsum?",
                        "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
                        "category_id": 3,
                        "option": "Option B",
                        "is_correct_choice": false,
                        "category": "third cat",
                        "images": [],
                        "voices": []
                    },
                    {
                        "id": "10",
                        "description": "...",
                        "question_id": "7",
                        "option_id": "12",
                        "report_id": "3",
                        "is_deleted": false,
                        "list_order": 500,
                        "title": "A question?",
                        "paragraph": "",
                        "category_id": 3,
                        "option": "Option B",
                        "is_correct_choice": false,
                        "category": "third cat",
                        "images": [],
                        "voices": []
                    }
                ]
            }
        ]
    }
}
}
 */
const get = async (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const report = await fetchService(id);
    // Check access
    if (!accessCheck(user, report)) {
        return error(response, 403, {});
    }

    return ok(response, report);
};

module.exports = get;
