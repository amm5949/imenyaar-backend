const { ok } = require('../../../core/util/response');
const orderService = require('../services/order');

/**
 * @api {get} /api/questions/order/:category_id Get list ordering
 * @apiGroup Questions
 * @apiName GetQuestionOrder
 * @apiVersion 1.0.0
 * @apiDescription Get list of question orders based on category id.
 *
 * @apiParam (Path param) {number} category_id category ID
 *
 * @apiSuccess {object[]} result List of questions
 * @apiSuccess {number} result.id Question Id
 * @apiSuccess {number} result.list_order Question order
 * @apiSuccess {string} result.title Question title
 * @apiSuccess {string} result.paragraph Question paragraph
 * @apiSuccess {string} result.category_name Question category name.
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
            "id": 8,
            "list_order": 400,
            "title": "Lorem Ipsum?",
            "paragraph": "",
            "name": "third category"
        },
        {
            "id": 7,
            "list_order": 500,
            "title": "Is this a question?",
            "paragraph": "dolor sit amet consectetur adipiscing elit, sed do.",
            "name": "third category"
        }
    ]
}
 */
const order = async (request, response) => {
    const categoryID = request.params.category_id;
    const questions = await orderService.getQuestionsOrdered(categoryID);
    return ok(response, questions);
};

module.exports = async (request, response) => {
    await order(request, response);
};
