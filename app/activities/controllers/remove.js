const removeService = require('../services/remove');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {delete} /api/activities/:id delete
 * @apiName DeleteActivity
 * @apiGroup Activities
 * @apiVersion 1.0.0
 * @apiDescription Delete an activity
 */

const remove = async (request, response) => {
    const { id } = request.params;
    const activity = await removeService.fetch_activity(id);
    if (activity === undefined) {
        return error(response, 404, {
            en: 'Activity not found.',
            fa: 'فعالیت یافت نشد.',
        });
    }
    await removeService.remove_activity(id);
    return ok(response, activity, {
        en: 'Activity deleted',
        fa: 'فعالیت حذف شد',
    }, 200);
};

module.exports = async (request, response) => {
    await remove(request, response);
};
