const fetchService = require('../services/fetch');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../../projects/services/accessCheck.js');
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
 * @apiSuccessExample 
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 3,
        "name": "test zone",
        "project_id": 1,
        "properties": "special",
        "details": "very important detail"
    }
}
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
    if (!(await accessCheck(request.user, zone.project_id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    return ok(response, zone, { }, 200);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
