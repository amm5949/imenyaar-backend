const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/categories create
 * @apiName CreateCategory
 * @apiGroup Categories
 * @apiVersion 1.0.0
 * @apiDescription Create a category
 *
 * @apiParam {String} name Category name
 * @apiParam {Number} [parent_id] Parent category id
 *
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    if (!Object.prototype.hasOwnProperty.call(result.data, 'parent_id')) {
        result.data.parent_id = null;
    }
    const category = await createService(result.data);
    return ok(response, category, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
