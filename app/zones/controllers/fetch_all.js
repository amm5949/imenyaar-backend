const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/zones list
 * @apiName ListZones
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription List all zones, output format is same as FetchZone but zones are in an array
 * @apiParam {String} name        provided in query
 * @apiParam {Number} project_id  provided in query
 * @apiParam {String} properties  provided in query
 * @apiParam {String} details     provided in query
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
                "name": "test zone",
                "project_id": 1,
                "properties": "zone properties",
                "details": "zone details"
            }
        ],
        "page_count": 1
    }
}
 */

const list = async (request, response) => {
    const zones = await listService.fetch_zones(request.query);
    return ok(response, zones, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
