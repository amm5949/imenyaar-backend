const removeService = require('../services/remove');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../../projects/services/accessCheck.js');
/**
 * @api {delete} /api/activities/:id delete
 * @apiName DeleteActivity
 * @apiGroup Activities
 * @apiVersion 1.0.0
 * @apiDescription Delete an activity
 *
 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "Activity deleted",
        "fa": "فعالیت حذف شد"
    },
    "result": {
        "id": 17,
        "start_date": "2021-07-13T19:30:00.000Z",
        "scheduled_end_date": "2021-07-13T19:30:00.000Z",
        "project_id": 1,
        "people": [
            3
        ],
        "zones": [
            2
        ],
        "status": "3",
        "is_done": false
    }
}
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
    if (!(await accessCheck(request.user, activity.project_id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
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
