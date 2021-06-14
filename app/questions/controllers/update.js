const { ok, error } = require('../../../core/util/response');
const validator = require('../../../core/util/validator');
const updateSchema = require('../schemas/update');
const updateService = require('../services/update');

/**
 * @api {post} /api/questions/:id Update
 * @apiGroup Questions
 * @apiName UpdateQuestion
 * @apiVersion 1.0.0
 * @apiDescription Create a new question and its options
 * @apiParam (Path param) {number} id Id
 * @apiParam {string} [title] Title
 * @apiParam {string} [paragraph] Paragraph
 * @apiParam {number} [list_order] order (priority) among category questions,
 * use list_order api to get available numbers. Defaults to count * 100.
 * @apiParam {boolean} [has_correct_choice] Defines that the question has correct choice.
 * default is true. send `options.is_correct_choice` in any case.
 *
 * @apiSuccessExample success-example: 
 * HTTP/1.1 200 
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 9,
            "list_order": 350,
            "title": "Brand new question",
            "paragraph": "Sphinx of Black Quartz",
            "category_id": 2,
            "is_base": true,
            "has_correct_choice": true
        }
    ]
}
 * @apiParamExample {json} request-example:
{
    "title": "Brand new question",
    "list_order": 350
}
 * @apiErrorExample
 */

module.exports = async (request, response) => {
    // validates input
    const questionsResult = validator(updateSchema, request.body);
    if (questionsResult.failed) {
        return questionsResult.response(response);
    }
    const question = questionsResult.data;
    const { id } = request.params;
    if (!(await updateService.fetchQuestion(id))) {
        return error(response, 403, {
            en: 'Question not found.',
            fa: 'سوال یافت نشد.',
        });
    }
    // Update question
    const record = await updateService.updateQuestion(question, id);

    return ok(response, record, {});
};
