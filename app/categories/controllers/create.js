const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

/**
 * @api {post} /api/categories create
 * @apiName CreateCategory
 * @apiGroup Categories
 * @apiVersion 1.0.0
 * @apiDescription Create a category, each category either has a parent
 * or is defaulted as a child of a wrapper category with `id=1`,
 * i.e. categories with `parent_id = 1` are actually top-level categories.
 *
 * @apiParam {String} name Category name
 * @apiParam {Number} [parent_id=1] Parent category id
 * @apiParamExample
{
	"name": "Random"
}
 * @apiSuccess {Object} result.category Category details.
 * @apiSuccessExample
 * HTTP/1.1 200
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 5,
        "name": "Random",
        "parent_id": 1
    }
}
 */

const create = async (request, response) => {
    const result = validator(createSchema, request.body);

    if (result.failed) {
        return result.response(response);
    }
    if (!Object.prototype.hasOwnProperty.call(result.data, 'parent_id')) {
        result.data.parent_id = 1;
    }
    const category = await createService(result.data);
    return ok(response, category, {}, 200);
};

module.exports = async (request, response) => {
    await create(request, response);
};
