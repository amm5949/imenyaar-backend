const fetchService = require('../services/fetch_project_people.js');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../services/accessCheck.js');
/**
 * @api {get} /api/projects/people/:id Fetch people
 * @apiName Fetch Project People
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Fetch project people
 * 
 * @apiSuccess {Number} id
 * @apiSuccess {String} name
 * @apiSuccess {Number} owner_id
 * @apiSuccess {Date} start_date
 * @apiSuccess {Date} scheduled_end
 * @apiSuccess {String} address
 * @apiSuccess {Number} area
 * @apiSuccess {Boolean} is_multizoned
 * @apiSuccess {Array} people see example.
 * 
 * @apiSuccessExample {json} Success-Response:
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 1,
        "name": "project",
        "owner_id": 3,
        "start_date": "2020-12-30T20:30:00.000Z",
        "scheduled_end": "2020-12-30T20:30:00.000Z",
        "address": "addres",
        "area": 12345,
        "is_multizoned": true,
        "people": [
            {
                "user_id": 1,
                "first_name": "t",
                "last_name": "t"
            },
            {
                "user_id": 2,
                "first_name": "t",
                "last_name": "t"
            }
        ]
    }
}
 *
 */

const fetch = async (request, response) => {
    const { id } = request.params;
    if (!(await accessCheck(request.user, id))) {
        return error(response, 403, {
            en: 'you don\'t have access to this project',
        });
    }
    const project = await fetchService.fetch_project(id);
    if (!project) {
        return error(response, 404, {
            en: 'Project not found.',
            fa: 'پروژه یافت نشد.',
        });
    }
    const people = await fetchService.fetch_people(id);
    return ok(response, people, { }, 200);
};

module.exports = async (request, response) => {
    await fetch(request, response);
};
