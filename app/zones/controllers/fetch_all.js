const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/zones list
 * @apiName ListZones
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription List all zones, output format is same as FetchZone but zones are in an array
 * @apiParam {String} name       , provided in query
 * @apiParam {Number} project_id , provided in query
 * @apiParam {String} properties , provided in query
 * @apiParam {String} details    , provided in query
 *
 */

const list = async (request, response) => {
    const zones = await listService.fetch_zones(request.query);
    return ok(response, zones, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
