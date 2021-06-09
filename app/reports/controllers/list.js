const listService = require('../services/list');
const { ok } = require('../../../core/util/response');
/**
 * @api {get} /api/reports/ Get all
 * @apiGroup Reports
 * @apiName GetAll
 * @apiVersion 1.0.0
 *
 * @apiParam (Query string) [page] Page, default is 1.
 * @apiParam (Query string) [size] Size, default is 10.
 * @apiParam (Query string) [from] Date.
 * @apiParam (Query string) [to] Date.
 * @apiParam (Query string) [category_id] filter based on category_id.
 *
 * @apiSuccess {object[]} result.items Reprots list
 * @apiSuccess {number} result.items.id Id
 * @apiSuccess {number} result.items.category_id Category id
 * @apiSuccess {number} result.items.category_name category name
 * @apiSuccess {string} result.items.address Address
 * @apiSuccess {string} result.items.description Description
 * @apiSuccess {float} result.items.correctness_percent Report correctness percent
 * @apiSuccess {date} result.items.start_date Start date of report. Format is`yyyy/mm/dd hh:ii:ss in jalali.
 * @apiSuccess {date} result.items.end_date End date of report. Format is`yyyy/mm/dd hh:ii:ss in jalali.
 * @apiSuccess {string} result.items.first_name User first name
 * @apiSuccess {string} result.items.last_name User last name
 * @apiSuccess {string} result.items.username User username
 * @apiSuccess {number} result.pageCount Number of pages
 *
 * @apiSuccessExample
HTTP/1.1 200
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "items": [
            {
                "id": "9",
                "user_id": 1,
                "address": "first added question",
                "description": "some long text",
                "correctness_percent": 0.5,
                "start_date": "1399/01/01 21:01:33",
                "end_date": "1399/01/0122:00:30",
                "is_deleted": false,
                "category_id": "2",
                "first_name": "svv",
                "last_name": "svv",
                "username": "svv",
                "category_name": "ضوابط طراحی و متناسب سازی ساختمان های عمومی"
            }
        ],
        "pageCount": "1"
    }
}
 */
const list = async (request, response) => {
    const { page = 1, size = 10, ...filter } = request.query;
    const { user } = request;

    const reports = await listService.all({
        page,
        size,
        ...filter,
        user_id: user.roles[0].id === 2 ? user.id : undefined,
    });
    const { count } = await listService.count({
        ...filter,
        user_id: user.roles[0].id === 2 ? user.id : undefined,
    });
    console.log(count)
    return ok(response, {
        items: reports,
        pageCount: Math.ceil(count / size),
    });
};

module.exports = list;
