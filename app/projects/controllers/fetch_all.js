const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/projects list
 * @apiName ListProjects
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription List all projects, output format is same as FetchProject but projects are in an array
 * @apiParam {String} name, provided in query
 * @apiParam {Number} owner_id, provided in query
 * @apiParam {Date} start_date, acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end, acceptable format is "new Date()" provided in query
 * @apiParam {String} address, provided in query
 * @apiParam {Number} area, provided in query
 * @apiParam {Boolean} is_multizoned, provided in query

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
                "id": 2,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 3,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 4,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 5,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 6,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 7,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 8,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 9,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 10,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            },
            {
                "id": 11,
                "name": "test prj",
                "owner_id": 1,
                "start_date": "2021-04-24T19:30:00.000Z",
                "scheduled_end": "2021-04-24T19:30:00.000Z",
                "address": "heeeereeeeeeeeeeeeeeeeeee",
                "area": 12312321312.231,
                "is_multizoned": false
            }
        ],
        "page_count": 2
    }
}
 *
 */

const list = async (request, response) => {
    const projects = await listService.fetch_projects(request.query);
    return ok(response, projects, {}, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await list(request, response);
    } catch (err) {
        return next(err);
    }
};
