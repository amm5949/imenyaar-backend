const removeService = require('../services/remove');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {delete} /api/zones/:id delete
 * @apiName DeleteZone
 * @apiGroup Zones
 * @apiVersion 1.0.0
 * @apiDescription Delete a zone
 */

const remove = async (request, response) => {
    const { id } = request.params;
    const zone = await removeService.fetch_zone(id);
    if (zone === undefined) {
        return error(request, 404, {
            en: 'zone not found',
            fa: 'زون یافت نشد',
        });
    }
    await removeService.remove_zones(id);
    return ok(response, zone, {
        en: 'zone deleted',
        fa: 'زون حذف شد',
    }, 200);
};

module.exports = async (request, response) => {
    await remove(request, response);
};
