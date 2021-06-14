const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/activities  list
 * @apiName ListActivities
 * @apiGroup Activites
 * @apiVersion 1.0.0
 * @apiDescription List all Activites, output format is same as FetchActivity but activities are in an array
 * @apiParam {Number} person_id provided in query
 * @apiParam {string} status provided in query
 * @apiParam {Date} start_date acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()" provided in query
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
                "id": 1,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 2,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 3,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 4,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 5,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 6,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 7,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 8,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 9,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            },
            {
                "id": 10,
                "start_date": "2021-06-13T19:30:00.000Z",
                "scheduled_end_date": "2022-06-13T19:30:00.000Z",
                "person_id": 3,
                "status": "test status",
                "is_done": false
            }
        ],
        "page_count": 1
    }
}
 */

const list = async (request, response) => {
    const projects = await listService.fetch_activities(request.query);
    return ok(response, projects, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
