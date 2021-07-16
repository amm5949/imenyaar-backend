const listService = require('../services/list');
const { ok } = require('../../../core/util/response');
/**
 * @api {get} /api/reports/ List
 * @apiGroup Reports
 * @apiName ListReports
 * @apiVersion 1.0.0
 *
 * @apiParam (Query string) [page=1] Page number
 * @apiParam (Query string) [size=10] Entries per page
 * @apiParam (Query string) [from] Date (from) fromat new Date() in js
 * @apiParam (Query string) [to] Date (to) fromat new Date() in js
 * @apiParam (Query string) [project_id] Project Id of the report.
 *
 * @apiSuccess {object[]} result.items Reprots list in descending order (latest first)
 * @apiSuccess {number} result.items.id Id
 * @apiSuccess {number} result.items.activity_id Activity id
 * @apiSuccess {number} result.items.zone_id Zone id
 * @apiSuccess {String}   result.items.creation_date Creation date of report. Format is `new Date()` of js.
 * @apiSuccess {string} result.items.user_id User id
 * @apiSuccess {string} result.items.first_name User first name
 * @apiSuccess {string} result.items.last_name User last name
 * @apiSuccess {number} result.pageCount Number of pages with current filter
 * @apiSuccess {number} result.count Number of all records (with current filter)
 *
 * @apiSampleRequest /api/reports/?to=2021-06-09T23:59:00.000Z&from=2021-01-09T23:59:00.000Z&size=2
 * @apiSuccessExample
{
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "items": [
            {
                "id": 3,
                "activity_id": 1,
                "zone_id": "1",
                "creation_date": "2021-06-08T19:30:00.000Z",
                "parent_id": null,
                "user_id": "5",
                "first_name": "John",
                "last_name": "Wick"
            },
            {
                "id": 1,
                "activity_id": 1,
                "zone_id": "1",
                "creation_date": "2021-06-08T19:30:00.000Z",
                "parent_id": null,
                "user_id": "1",
                "first_name": "John",
                "last_name": "Doe"
            }
        ],
        "pageCount": 2,
        "count": 4
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
        user_id: (user.roles[0].id === 2 || user.roles[0].id === 1) ? user.id : undefined,
    });
    const { count } = await listService.count({
        ...filter,
        user_id: (user.roles[0].id === 2 || user.roles[0].id === 1)  ? user.id : undefined,
    });
    return ok(response, {
        items: reports,
        count: count,
        pageCount: Math.ceil(count / size),
    });
};

module.exports = list;
