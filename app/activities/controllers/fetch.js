const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../../projects/services/accessCheck.js');
/**
 * @api {get} /api/activities/:id fetch
 * @apiName FetchActivity
 * @apiGroup Activities
 * @apiVersion 1.0.0
 * @apiDescription Fetch an activity
 * @apiSuccess {Number} id
 * @apiSuccess {Number} project_id
 * @apiSuccess {Array} people array of people associated with this activity
 * @apiSuccess {Array} zones array of zones associated with this activity
 * @apiSuccess {Number} status
 * @apiSuccess {Date} start_date
 * @apiSuccess {Date} scheduled_end_date
 * @apiSuccess {Boolean} is_done
 *
 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 17,
        "start_date": "2021-07-13T19:30:00.000Z",
        "scheduled_end_date": "2021-07-13T19:30:00.000Z",
        "project_id": 1,
        "people": [
            3
        ],
        "zones": [
            2
        ],
        "status": "10",
        "is_done": false
    }
}
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
    if (!(await accessCheck(request.user, activity.project_id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    return ok(response, activity, { }, 200);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
