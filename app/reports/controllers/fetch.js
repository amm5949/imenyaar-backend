const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../helpers/access');

/**
 * @api {get} /api/reports/:id Get
 * @apiGroup Reports
 * @apiName GetReport
 * @apiVersion 1.0.0
 *
 * @apiParam (Path Param) id Report id
 *
 * @apiSuccess {object[]} result Reprots data
 * @apiSuccess {number} result.id Id
 * @apiSuccess {string} result.address Address
 * @apiSuccess {string} result.description Description
 * @apiSuccess {number} result.items.category_id Category id
 * @apiSuccess {number} result.items.category_name category name
 * @apiSuccess {date} result.start_date Start date of report. Format is Date() in js.
 * @apiSuccess {date} result.end_date End date of report. Format is Date() in js.
 * @apiSuccess {string} result.first_name User first name
 * @apiSuccess {string} result.last_name User last name
 * @apiSuccess {object[]} result.answers Answers
 * @apiSuccess {string} result.answers.category Category name
 * @apiSuccess {number} result.answers.answers.id Answer id
 * @apiSuccess {number} result.answers.answers.question_id Question id
 * @apiSuccess {number} result.answers.answers.option_id Option id
 * @apiSuccess {number} result.answers.answers.report_id Report id
 * @apiSuccess {string} result.answers.answers.description Answer description
 * @apiSuccess {string} result.answers.answers.title Question title
 * @apiSuccess {string} result.answers.answers.paragraph Question paragraph
 * @apiSuccess {number} result.answers.answers.category_id Category id
 * @apiSuccess {string} result.answers.answers.option Option text
 * @apiSuccess {boolean} result.answers.answers.is_correct_choice Is correct choice
 * @apiSuccess {string} result.answers.answers.category Category
 * @apiSuccess {object[]} result.answers.answers.images Images
 * @apiSuccess {number} result.answers.answers.images.id Image id
 * @apiSuccess {string} result.answers.answers.images.path Image path
 * @apiSuccess {number} result.answers.answers.images.answer_id Answer id
 * @apiSuccess {object[]} result.answers.answers.voices Voices
 * @apiSuccess {number} result.answers.answers.voices.id Voice id
 * @apiSuccess {string} result.answers.answers.voices.path Voice path
 * @apiSuccess {number} result.answers.answers.voices.answer_id Answer id
 *
 * @apiSuccessExample
HTTP/1.1 200

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
