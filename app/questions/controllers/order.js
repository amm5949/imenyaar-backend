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
            "id": 173,
            "list_order": 100,
            "title": "آیا در کف، لبه اولین و آخرین پله و در پاگرد علایم حسی تعبیه شده است؟",
            "paragraph": "",
            "name": "پله"
        },
        {
            "id": 174,
            "list_order": 200,
            "title": "ایا علایم حسی برای افراد با محدودیت بینایی توسط نشانه گر های لمسی سطح پیاده‌رو قابل تشخیص است؟ (بند 1-1-2-9-1) ",
            "paragraph": "",
            "name": "پله"
        },
        {
            "id": 175,
            "list_order": 300,
            "title": "ایا نشانگر های لمسی در محل های مشخص و منطقی قرارداده شده تا باعث گیج شدن عابران نشوند؟(بند 3-1-2-9-3) ",
            "paragraph": "",
            "name": "پله"
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
