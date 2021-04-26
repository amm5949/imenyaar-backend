const removeService = require('../services/remove');
const { ok, error } = require('../../../core/util/response');

/**
 * @api {delete} /api/projects/:id delete
 * @apiName DeleteProject
 * @apiGroup Projects
 * @apiVersion 1.0.0
 * @apiDescription Delete a project
 */

const remove = async (request, response) => {
    const { id } = request.params;
    const project = await removeService.fetch_project(id);
    if (project === undefined) {
        return error(request, 404, {
            en: 'project not found',
            fa: 'پروژه یافت نشد',
        });
    }
    await removeService.remove_project(id);
    return ok(response, project, {
        en: 'project deleted',
        fa: 'پروژه حذف شد',
    }, 200);
};

module.exports = async (request, response) => {
    await remove(request, response);
};
