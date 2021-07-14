const { ok, error } = require('../../../core/util/response');
const listService = require('../services/list');

/**
 * @api {get} /api/incidents/list/:zone_id Get incident reports of a zone
 * @apiGroup Incidents
 * @apiName ListIncidents
 * @apiVersion 1.0.0
 * @apiDescription Get list of incidents, can be filtered by zone and date (to/from).
 * If user is admin, all incidents are returned, for project admins all relevant incidents are returned,
 * and for supervisors only incidents with their id as author is returned.
 * 
 * @apiParam (Query string) [page=1] Page number
 * @apiParam (Query string) [size=10] Entries per page
 * @apiParam (Query string) [zone_id] Zone Id of the incidents. 
 * @apiParam (Query string) [from] Date (from) fromat new Date() in js, can be truncated to date only (e.g. `2021-06-15`).
 * @apiParam (Query string) [to] Date (to) fromat new Date() in js, can be truncated to date only (e.g. `2021-06-15`).
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
        "items": [
            {
                "id": 3,
                "zone_id": 1,
                "type": "minor",
                "financial_damage": 1000,
                "human_damage": 1500,
                "date": "2021-07-15T19:05:34.659Z",
                "description": "info",
                "hour": 19,
                "reason": "still investigating",
                "user_id": "1",
                "first_name": "Admin",
                "last_name": "Admin"
            },
            {
                "id": 1,
                "zone_id": 1,
                "type": "some type",
                "financial_damage": 1000,
                "human_damage": 1500,
                "date": "2021-07-14T08:35:34.258Z",
                "description": "some info",
                "hour": 20,
                "reason": "someone was tired",
                "user_id": "1",
                "first_name": "Admin",
                "last_name": "Admin"
            },
            {
                "id": 2,
                "zone_id": 1,
                "type": "some type 2",
                "financial_damage": 1000,
                "human_damage": 1500,
                "date": "2021-06-15T21:05:34.659Z",
                "description": "info",
                "hour": 19,
                "reason": "someone was done",
                "user_id": "2",
                "first_name": "John",
                "last_name": "Silver"
            }
        ],
        "count": "3",
        "pageCount": 1
    }
}
 */

const list = async (request, response) => {
    const { page = 1, size = 10, ...filter } = request.query;
    const { user } = request;

    const incidents = await listService.all( {
        page,
        size,
        ...filter,
        // return only that users' records 
        // unless there's higher clearance
        user_id: user.id,
        user_role: user.roles[0].id
    });

    const { count } = await listService.count({
        ...filter,
        user_id: user.id,        
        user_role: user.roles[0].id
    });
    return ok(response, {
        items: incidents,
        count: count,
        pageCount: Math.ceil(count / size),
    });
};

module.exports = async (request, response) => {
    await list(request, response);
};
