const { ok, error } = require('../../../core/util/response');
const deleteService = require('../services/remove');

/**
 * @api {delete} /api/questions/:id Remove
 * @apiGroup Questions
 * @apiName RemoveQuestion
 * @apiVersion 1.0.0
 * @apiDescription remove an unanswered question
 *
 * @apiParam (Path param) {number} id ID
 */
const remove = async (request, response) => {
    const questionsID = request.params.id;
    const question = await deleteService.fetchQuestion(questionsID);
    if (!question) {
        return error(response, 404, {
            en: 'no questions with this ID exists',
            fa: 'سوالی با این شماره وجود ندارد',
        });
    }
    const answerCount = (await deleteService.getAnswerCount(questionsID)).count;
    if (answerCount > 0) {
        return error(response, 400, {
            en: 'this question has been answered and cannot be deleted',
            fa: 'به این سوال پاسح داده شده است و قابل حذف نمی باشد',
        });
    }
    await deleteService.deleteQuestion(questionsID);
    return ok(response, {}, {
        en: 'question has been deleted',
        fa: 'سوال حذف شد',
    });
};

module.exports = async (request, response) => {
    await remove(request, response);
};
