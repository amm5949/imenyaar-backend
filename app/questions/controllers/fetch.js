const { ok, error } = require('../../../core/util/response');
const fetchService = require('../services/fetch');


/**
 * @api {get} /api/questions/:id Get question
 * @apiGroup Questions
 * @apiName GetQuestion
 * @apiVersion 1.0.0
 * @apiParam (Path param) {number} id ID
 * @apiSuccess {object} result question
 * @apiSuccess {number} result.id Question Id
 * @apiSuccess {string} result.title Question title
 * @apiSuccess {string} result.paragraph Question paragraph
 * @apiSuccess {boolean} result.is_base Determines whether an option is linked to
 * this question or not.
 * @apiSuccess {string} result.category_name Question category name.
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
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 2,
        "list_order": 100,
        "title": "second_q",
        "paragraph": "hi there",
        "category_id": 1,
        "is_base": true,
        "has_correct_choice": true,
        "category_name": "test",
        "images": [],
        "options": [
            {
                "id": 3,
                "option": "first",
                "question_id": 2,
                "is_correct_choice": true,
                "links": []
            },
            {
                "id": 4,
                "option": "second",
                "question_id": 2,
                "is_correct_choice": false,
                "links": []
            }
        ]
    }
}
 */
const fetch = async (request, response) => {
    const { id } = request.params;
    const result = await fetchService.getQuestions(id);
    if (result.error) {
        return error(response, 404, { en: result.error });
    }
    return ok(response, result.data);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
