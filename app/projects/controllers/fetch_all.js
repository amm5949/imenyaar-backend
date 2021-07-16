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
 * @apiParam {Date} start_date_from acceptable format is "new Date()" provided in query
 * @apiParam {Date} start_date_to acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date_from acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date_to acceptable format is "new Date()" provided in query
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
                "id": 1,
                "name": "project",
                "owner_id": 3,
                "start_date": "2020-12-30T20:30:00.000Z",
                "scheduled_end": "2020-12-30T20:30:00.000Z",
                "address": "addres",
                "area": 12345,
                "is_multizoned": true
            }
        ],
        "page_count": 1
    }
}
 *
 */

const list = async (request, response) => {
    const projects = await listService.fetch_projects(request.query, request.user);
    return ok(response, projects, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
