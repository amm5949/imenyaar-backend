const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/activities/:id fetch
 * @apiName FetchActivity
 * @apiGroup Activities
 * @apiVersion 1.0.0
 * @apiDescription Fetch an activity
 * @apiSuccess {Number} id
 * @apiSuccess {Number} person_id
 * @apiSuccess {string} status
 * @apiSuccess {Date} start_date
 * @apiSuccess {Date} scheduled_end_date
 * @apiSuccess {Boolean} is_done
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    const activity = await fetchService.fetch_activity(id);
    if (!activity) {
        return error(response, 404, {
            en: 'Activity not found.',
            fa: 'فعالیت یافت نشد.',
        });
    }
    return ok(response, activity, { }, 200);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
