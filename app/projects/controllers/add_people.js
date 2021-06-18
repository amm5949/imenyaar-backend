/* eslint-disable camelcase */
const add_people_service = require('../services/add_people');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const add_people_schema = require('../schemas/add_people');
const subscriptionService = require('../../subscription/services/verify');
/**
 * @api {post} /api/projects/addpeople/:id add people
 * @apiName AddPeopleToProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Add multiple people to a project
 *
 * @apiParamExample
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
 * @apiError (403) {Object} maximumMembersReached Owner not allowed to add more people.
 * @apiErrorExample {json} maximumMembersReached
 * HTTP/1.1 400
 *  {
 *     "status": "error",
 *     "message": {
 *          "en": "Maximum allowed project members reached.",
            "fa": "از سقف اعضای مجاز این پروژه عبور کرده‌اید."
 *     }
 * }
 */

const added_people = async (request, response) => {
    const { id } = request.params;
    const result = validator(add_people_schema, request.body);
    if (result.failed) {
        return result.response(response);
    }
    if (!subscriptionService.checkPeople(request.user.id, id)){
        return error(response, 403, {
            en: 'Maximum allowed project members reached.',
            fa: 'از سقف اعضای مجاز این پروژه عبور کرده‌اید.'
        });
    }
    const { data } = result;
    const project = await add_people_service.fetch_project(id);
    if (project === undefined) {
        return error(response, 404, {
            en: 'project not found',
        });
    }
    add_people_service.fetch_user(data.people);
    if (!(await add_people_service.fetch_user(data.people))) {
        return error(response, 404, {
            en: 'one or more the users were not found',
        });
    }
    const added_people_ret = await add_people_service.add_people(id, data.people);
    return ok(response, added_people_ret, { en: 'project updated' }, 200);
};

module.exports = async (request, response) => {
    await added_people(request, response);
};
