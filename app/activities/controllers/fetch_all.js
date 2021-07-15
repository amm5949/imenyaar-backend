const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/activities  list
 * @apiName ListActivities
 * @apiGroup Activites
 * @apiVersion 1.0.0
 * @apiDescription List all Activites, output format is same as FetchActivity but activities are in an array
 * @apiParam {Number} project_id  
 * @apiParam {Number} status provided in query
 * @apiParam {Array} people array of people associated with this activity, you can provide it in query like people={3} or people={1, 2, 3}
 * @apiParam {Array} zones array of zones associated with this activity, you can provide it in query like zones={3, 4, 5} or zones={3}
 * @apiParam {Date} start_date_from acceptable format is "new Date()" provided in query
 * @apiParam {Date} start_date_to acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date_from acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date_to acceptable format is "new Date()" provided in query
 * @apiParam {Boolean} is_done provided in query

 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "values": [
            {
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
                "status": "3",
                "is_done": false
            },
            {
                "id": 18,
                "start_date": "2021-07-13T19:30:00.000Z",
                "scheduled_end_date": "2021-07-13T19:30:00.000Z",
                "project_id": 1,
                "people": [
                    3
                ],
                "zones": [
                    2
                ],
                "status": "3",
                "is_done": false
            }
        ],
        "page_count": 1
    }
}
 */

/* eslint-disable */
const list = async (request, response) => {
    const activities = await listService.fetch_activities(request.query, request.user);
    return ok(response, activities, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
