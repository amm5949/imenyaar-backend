const { ok, error } = require('../../../core/util/response');
const fetchService = require('../services/fetch');
const accessCheck = require('../helpers/access');

/**
 * @api {get} /api/incidents/fetch/:incident_id Fetch
 * @apiGroup Incidents
 * @apiName FetchIncidents
 * @apiVersion 1.0.0
 * @apiDescription Fetch a report and all its updates
 * @apiSuccessExample
 HTTP/1.1 200
 {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 2,
            "zone_id": 1,
            "type": "some type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "reason": "someone was tired",
            "previous_version": null
        },
        {
            "id": 15,
            "zone_id": 1,
            "type": "some new type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "reason": "someone was super tired",
            "previous_version": 2
        },
        {
            "id": 16,
            "zone_id": 1,
            "type": "some brand new type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "hour": 21,
            "reason": "someone was eating",
            "previous_version": 15
        }
    ]
}
 * @apiError (403) ForbiddenAccess Incident not accessible.
 * @apiError (404) NotFound Incident not found.
 */
const fetch = async (request, response) => {
    const { incident_id: incidentID } = request.params;
    const {user} = request.user;
    const incidents = await fetchService.fetchIncident(incidentID);
    if (!incidents.length) {
        return error(response, 404, { en: 'invalid incident id' });
    }
    // Check access
    if (!(await accessCheck.byIncident(user, incidents[0]))) {
        return error(response, 403, {});
    }
    return ok(response, incidents);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
