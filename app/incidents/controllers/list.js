const { ok, error } = require('../../../core/util/response');
const listService = require('../services/list');

/**
 * @api {get} /api/incidents/list/:zone_id Get incident reports of a zone
 * @apiGroup Incidents
 * @apiName ListIncidents
 * @apiVersion 1.0.0
 * @apiDescription Get list of incidents based on zone
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
            "id": 1,
            "zone_id": 1,
            "type": "some type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "hour": 20,
            "reason": "someone was tired",
            "previous_version": null
        },
        {
            "id": 2,
            "zone_id": 1,
            "type": "some type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "hour": 20,
            "reason": "someone was tired",
            "previous_version": null
        },
        {
            "id": 3,
            "zone_id": 1,
            "type": "some type",
            "financial_damage": 1000,
            "human_damage": 1500,
            "date": "2021-07-12T19:30:00.000Z",
            "description": "some info",
            "hour": 20,
            "reason": "someone was tired",
            "previous_version": null
        }
    ]
}
 */

const list = async (request, response) => {
    const { zone_id: zoneID } = request.params;
    const zone = await listService.getZone(zoneID);
    if (!zone) {
        return error(response, 404, { en: 'invalid zone id' });
    }
    const incidents = await listService.listIncidentsByZone(zoneID);
    return ok(response, incidents);
};

module.exports = async (request, response) => {
    await list(request, response);
};
