const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/zones list
 * @apiName ListZones
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription List all zones, output format is same as FetchZone but zones are in an array
 * @apiParam {String} name        zone name
 * @apiParam {Number} project_id  project id
 * @apiParam {Number} project_name  project name
 * @apiParam {String} properties  zone properties
 * @apiParam {String} details     zone details
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
                "id": 3,
                "name": "test zone",
                "project_id": 1,
                "project_name": "Project X",
                "properties": "special",
                "details": "very important detail"
            }
        ],
        "page_count": 1
    }
}
 */

const list = async (request, response) => {
    const zones = await listService.fetch_zones(request.query, request.user);
    return ok(response, zones, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
