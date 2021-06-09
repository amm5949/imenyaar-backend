const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {get} /api/zones/:id fetch
 * @apiName FetchZones
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription Fetch a zone
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {Number} project_id
 * @apiSuccess {String} properties
 * @apiSuccess {String} details
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    const zone = await fetchService.fetch_zone(id);
    if (!zone) {
        return error(response, 404, {
            en: 'Zone not found.',
            fa: 'زون یافت نشد.',
        });
    }
    return ok(response, zone, { }, 200);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};