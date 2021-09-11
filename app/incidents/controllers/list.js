const { ok, error } = require('../../../core/util/response');
const listService = require('../services/list');
const accessCheck = require('../../projects/services/accessCheck');


/**
 * @api {get} /api/incidents/list/:project_id Get incident reports of a project
 * @apiGroup Incidents
 * @apiName List Incidents
 * @apiVersion 1.0.0
 * @apiDescription Get list of incidents for a project, filtering options are available.
 * Note that this returns *all* logs as well, not just the latest version. Filter those on the frontend as needed.
 *
 * @apiParam (Query string) [page=1] Page number
 * @apiParam (Query string) [size=10] Entries per page
 * @apiParam (Query string) [zone_id] Zone Id of the incidents.
 * @apiParam (Query string) [activity_id] Activity Id of the incidents.
 * @apiParam (Query string) [from] Date (from) format new Date() in js, can be truncated to date only
 *  (e.g. `2021-06-15`).
 * @apiParam (Query string) [to] Date (to) format new Date() in js, can be truncated to date only
 *  (e.g. `2021-06-15`).
 *
 * @apiSuccessExample
 HTTP/1.1 200
 {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"incidents": [
			{
				"id": 1,
				"activity_id": 2,
				"zone_id": 4,
				"user_id": "1",
				"type": "mundane",
				"financial_damage": 100,
				"human_damage": 0,
				"date": "2021-09-11T16:55:34.689Z",
				"description": "some screw got loose",
				"reason": "someone forgot something",
				"previous_version": null,
				"zone_name": "dam zone II"
			}
		],
		"pageCount": 1
	}
}
 */

const list = async (request, response) => {
    const { user } = request;
    const { project_id: projectID } = request.params;

    if (!(await accessCheck(user, projectID, 'fetch'))) {
        return error(response, 403, {
            en: 'you do not have access to this project',
        });
    }
    const { zone_id: zoneID, activity_id: activityID, to, from, page = 1, size = 10 } = request.query;
    const incidents = await listService.listIncidents(projectID, zoneID, activityID, page, size, to, from);
    const { count } = await listService.count(projectID, zoneID, activityID, to, from);
    return ok(response, {
        incidents,
        pageCount: Math.ceil(count / size),
    });
};

module.exports = async (request, response) => {
    await list(request, response);
};
