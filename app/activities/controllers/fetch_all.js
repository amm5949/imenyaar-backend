const listService = require('../services/fetch_all');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/activities  list
 * @apiName ListActivities
 * @apiGroup Activites
 * @apiVersion 1.0.0
 * @apiDescription List all Activites, output format is same as FetchActivity but activities are in an array
 * @apiParam {Number} person_id provided in query
 * @apiParam {string} status provided in query
 * @apiParam {Date} start_date acceptable format is "new Date()" provided in query
 * @apiParam {Date} scheduled_end_date acceptable format is "new Date()" provided in query
 * @apiParam {Boolean} is_done provided in query

 * @apiSuccessExample
 *
 */

const list = async (request, response) => {
    const projects = await listService.fetch_projects(request.query);
    return ok(response, projects, {}, 200);
};

module.exports = async (request, response) => {
    await list(request, response);
};
