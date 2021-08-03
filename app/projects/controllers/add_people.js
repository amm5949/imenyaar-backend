/* eslint-disable camelcase */
const add_people_service = require('../services/add_people');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const add_people_schema = require('../schemas/add_people');
const subscriptionService = require('../../subscription/services/check');
const accessCheck = require('../services/accessCheck.js');
/**
 * @api {post} /api/projects/people/:id add people
 * @apiName Add People to Project
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Add multiple people to a project
 *
 * @apiParamExample {json} Request-Example
 {
    "people": [
        {
            "id": 1 //already existing user id
        },
        {
            "id": 2
        }
        ]
 }
 *
 * @apiError (404) {Object} NotFound Project/people not found.
 * @apiError (403) {Object} Forbidden Owner not allowed to add more people/doesn't have access to project.
 * @apiErrorExample {json} Forbidden
 * HTT/1.1 403 Forbidden
 *  {
 *     "status": "error",
 *     "message": {
 *          "en": "you don't have access to this project",
            "fa": "شما به این پروژه دسترسی ندارید."
 *     }
 * }
 * 
 * @apiErrorExample {json} Forbidden
 * HTTP/1.1 403 Forbidden
 *  {
	"status": "error",
	"message": {
		"en": "You can't add any more people to this project.",
		"fa": "شما نمی‌توانید افراد دیگری به این پروژه معرفی کنید."
	}
}
 */

const added_people = async (request, response) => {
    const { id } = request.params;
    const result = validator(add_people_schema, request.body);
    const user = request.user;
    if (result.failed) {
        return result.response(response);
    }
    const { data } = result;
    if (!(await accessCheck(request.user, id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
            fa: "شما به این پروژه دسترسی ندارید."
        });
    }
    // for now it's either one or many users
    // in future versions this may become a quantitive resource
    // it's best to then include project id.
    const canAddPerson = (
            user.roles[0].name === 'admin' ||
            await subscriptionService.checkByManager(user.id, 'can_add_person', id)
        );
    if (!canAddPerson){
        return error(response, 403, {
            en: "You can't add any more people to this project.",
            fa: "شما نمی‌توانید افراد دیگری به این پروژه معرفی کنید."
        });
    }
    const project = await add_people_service.fetch_project(id);
    if (project === undefined) {
        return error(response, 404, {
            en: 'project not found',
            fa: 'پروژه یافت نشد.'
        });
    }
    if (!(await add_people_service.fetch_user(data.people))) {
        return error(response, 404, {
            en: 'one or more the users were not found',
            fa: 'یک یا چند کاربر یافت نشدند.'
        });
    }
    const added_people_ret = await add_people_service.add_people(id, data.people);
    return ok(response, added_people_ret, { en: 'project updated' }, 200);
};

module.exports = async (request, response) => {
    await added_people(request, response);
};
