const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const accessCheck = require('../../projects/services/accessCheck.js');
const subscriptionService = require('../../subscription/services/check.js');
/**
 * @api {post} /api/activities create
 * @apiName Create Activity
 * @apiGroup Activities
 * @apiVersion 1.0.0
 * @apiDescription Create an Activity
 *
 * @apiParam {Number} project_id  
 * @apiParam {Array} people array of people associated with this activity, if empty the requesting user will be considered as the only member, but if it is provided and non are acceptable (they are not already added to project) an error will be returned 
 * @apiParam {Array} zones array of zones associated with this activity, if empty or non are acceptable an error will be returned
 * @apiParam {Number} status between 1 and 10 each representing a state
 * @apiParam {Date} start_date acceptable format is "new Date()" 
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()"
 *
 * @apiParamExample {json} Request-Example:
  {
    "status": 10,
    "project_id" : 1,
    "zones" : [2],
    "start_date": "2021-07-14T14:53:20.896Z",
    "scheduled_end_date": "2021-07-14T14:53:20.896Z"
  }
 * @apiSuccessExample 
  HTTP/1.1 200
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 17,
        "scheduled_end_date": "2021-07-13T19:30:00.000Z",
        "status": "10",
        "is_done": false,
        "start_date": "2021-07-13T19:30:00.000Z",
        "people": [
            3
        ],
        "zones": [
            2
        ],
        "project_id": 1
    }
}
 * @apiError (403) Forbidden permission denied/activity limit reached.
 * @apiErrorExample {json} Forbidden
 * HTTP/1.1 403 Forbidden
 * {
	"status": "error",
	"message": {
		"en": "you don't have access to this project",
		"fa": "شما به این پروژه دسترسی ندارید."
	}
 * }
 * @apiErrorExample {json} Forbidden
 * HTTP/1.1 403 Forbidden
 * {
	"status": "error",
	"message": {
		"en": "you have reached your activity limit.",
		"fa": "شما به سقف فعالیت‌های مجاز رسیده‌اید."
	}
 * }
 * @apiError (400) BadRequest zone/people not provided
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);
    const user = request.user;

    if (result.failed) {
        return result.response(response);
    }

    if (!(await accessCheck(user, result.data.project_id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
            fa: 'شما به این پروژه دسترسی ندارید.'
        });
    }
    if (user.roles[0].name !== 'admin' && !(await 
        subscriptionService.checkByManager(user.id, 'activity', result.data.project_id)
        )){
        return error(response, 403, {
            en: 'you have reached your activity limit.',
            fa: 'شما به سقف فعالیت‌های مجاز رسیده‌اید.'
        });
    }
    const activity_details = result.data;
    activity_details.zones = await createService.test_zones(activity_details.zones);
    if (activity_details.zones.length === 0) {
        return error(response, 400, {
            en: 'no acceptable zone',
        });
    }
    if (!activity_details.hasOwnProperty('people')) {
        activity_details.people = [request.user.id];
    }
    activity_details.people = await createService.test_users(activity_details.people); 
    if (activity_details.people.length === 0) {
        return error(response, 400, {
                en: 'no acceptable people',
            }); 
    }
    const activity = await createService.create(activity_details);
    delete activity.is_deleted;
    return ok(response, activity, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
