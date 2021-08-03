/* eslint-disable camelcase */
const add_people_service = require('../services/add_people');
const remove_people_service = require('../services/delete_people.js');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const add_people_schema = require('../schemas/add_people');
const accessCheck = require('../services/accessCheck.js');
/**
 * @api {delete} /api/projects/addpeople/:id Remove People
 * @apiName Remove People from Project
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription remove multiple people from a project
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
 * @apiSuccessExample {json} Success-Response
{
    "status": "ok",
    "message": {
        "en": "project updated",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "removed_people_count": 2
    }
}
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
    
    const { data } = result;
    if (!(await accessCheck(request.user, id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    const project = await add_people_service.fetch_project(id);
    if (project === undefined) {
        return error(response, 404, {
            en: 'project not found',
        });
    }
    if (!(await add_people_service.fetch_user(data.people))) {
        return error(response, 404, {
            en: 'one or more the users were not found',
        });
    }

    const added_people_ret = await remove_people_service.remove_people(id, data.people);
    return ok(response, added_people_ret, { en: 'project updated' }, 200);
};

module.exports = async (request, response) => {
    await added_people(request, response);
};
