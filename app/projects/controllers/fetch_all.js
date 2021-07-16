const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/projects list
 * @apiName ListProjects
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription List all projects. There are filters available for returned array,
 * owner_id filter also returns a count of active projects. To search in project name or address,
 * use filter parameter (but the process is slow, don't chain it!) It uses LIKE operator on the db.
 * 
 * @apiParam {Number} owner_id Id of project owner, also counts active projects (returning activeCount along count).
 * @apiParam {Date} start_date_from acceptable Acceptable format js' date.
 * @apiParam {Date} start_date_to acceptable Acceptable format js' date.
 * @apiParam {Date} scheduled_end_date_from Acceptable format js' date.
 * @apiParam {Date} scheduled_end_date_to Acceptable format js' date.
 * @apiParam {Boolean} is_multizoned Whether to filter multi-zoned projects (for stats)
 * @apiParam {String} filter Search filter, acceptable format is argument to a postgres `LIKE` operator.
 * @apiParam {Boolean} check_active If `true`, filter all active projects.

 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
       "items": [
			{
				"id": 1,
				"name": "Clerckenwell",
				"owner_id": 12,
				"first_name": "Tuesday",
				"last_name": "Weld",
				"start_date": "2021-06-08T19:30:00.000Z",
				"scheduled_end": "2021-06-29T19:30:00.000Z",
				"address": "Somewhere in the middle of nowhere",
				"area": 4009,
				"is_multizoned": false
			}
		],
		"count": "1",
		"pageCount": 1
	}
}
 *
 */

const list = async (request, response) => {
    const { page = 1, size = 10, ...data} = request.query;
    const { user } = request;
    const projects = await listService.fetch_projects(data, user);
    const count = await listService.count(data, user);
    return ok(response, {
        items: projects,
        count: count,
        pageCount: Math.ceil(count / size)
    }, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
