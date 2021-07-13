const { ok } = require('../../../core/util/response');
const listService = require('../services/list');

/**
 * @api {get} /api/questions/ Get questions
 * @apiGroup Questions
 * @apiName GetQuestions
 * @apiVersion 1.0.0
 * @apiDescription Get list of questions based on a category or an option.
 * In case you want all questions, give 1 as categoryId (`id=1` is a wrapper category).
 * 
 * @apiParam (Query string) {number} categoryId Questions based on category,
 * seperate categories with dash (-). `?category_id=5-4-32`
 * @apiParam (Query string) {number} optionId Questions based on links of the option.
 *
 * @apiSuccess {object[]} result List of questions
 * @apiSuccess {number} result.id Question Id
 * @apiSuccess {stirng} result.title Question title
 * @apiSuccess {string} result.paragraph Question paragraph
 * @apiSuccess {boolean} result.is_base Determines whether an option is linked to
 * this question or not.
 * @apiSuccess {stirng} result.category_name Question category name.
 * @apiSuccess {object[]} result.images List of question's images.
 * @apiSuccess {number} result.images.id Image Id
 * @apiSuccess {number} result.images.question_id Question id
 * @apiSuccess {string} result.images.path Image path
 * @apiSuccess {object[]} result.options List of question's options.
 * @apiSuccess {number} result.options.id Option Id
 * @apiSuccess {string} result.options.option Option text
 * @apiSuccess {number} result.options.question_id Question id
 * @apiSuccess {object[]} result.options.links Option links
 * @apiSuccess {number} result.options.links.id Link id
 * @apiSuccess {number} result.options.links.option_id Option id
 * @apiSuccess {number} result.options.links.question_id Linked question id
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
            "id": 7,
            "title": "Question-4",
            "paragraph": "Para-4",
            "category_id": 1,
            "is_base": false,
            "category_name": "parent_name-child_name",
            "images": [
            ],
            "options": [
                {
                    "id": 1,
                    "option": "option 1",
                    "is_correct_choice": false,
                    "question_id": 4,
                    "links": []
                },
                {
                    "id": 2,
                    "option": "option 2",
                    "is_correct_choice": false,
                    "question_id": 4,
                    "links": []
                }
            ]
        },
        {
            "id": 8,
            "title": "Question-1",
            "paragraph": "Para-1",
            "category_id": 1,
            "is_base": false,
            "category_name": "parent_name-child_name",
            "images": [
                {
                    "id": 73912,
                    "question_id": 8,
                    "path": "Question-8-0"
                },
                {
                    "id": 73913,
                    "question_id": 8,
                    "path": "Question-8-1"
                }
            ],
            "options": [
                {
                    "id": 4,
                    "option": "option 1",
                    "is_correct_choice": false,
                    "question_id": 5,
                    "links": [
                        {
                            "id": 3,
                            "option_id": 4,
                            "question_id": 7
                        },
                        {
                            "id": 4,
                            "option_id": 4,
                            "question_id": 8
                        }
                    ]
                },
                {
                    "id": 5,
                    "option": "option 2",
                    "is_correct_choice": false,
                    "question_id": 5,
                    "links": []
                },
                {
                    "id": 6,
                    "option": "option 3",
                    "is_correct_choice": true,
                    "question_id": 5,
                    "links": []
                }
            ]
        }
    ]
}
 */
const list = async (request, response) => {
    const { categoryId, optionId } = request.query;
    const categoryIds = categoryId.split('-');
    const questions = await listService.getQuestions(categoryIds, optionId);
    return ok(response, questions);
};

module.exports = async (request, response) => {
    await list(request, response);
};
