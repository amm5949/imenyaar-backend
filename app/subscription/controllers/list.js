const listService = require('../services/list');
const { ok } = require('../../../core/util/response');

/**
 * @api {get} /api/subscription/types list
 * @apiName ListSubscriptionTypes
 * @apiGroup subscription
 * @apiVersion 1.0.0
 * @apiDescription List all account subscription types. Currently the subscription
 * options are not fully implemented. There are commented blocks in projects and 
 * project people that can be used in later versions. See database schemas or modify
 * to suit needs.
 * 
 * @apiSuccessExample
 * HTTP/1.1 200
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 1,
            "name": "default",
            "allowed_project_count": 20,
            "person_per_project": 10,
            "duration_days": 365,
            "can_incident": false,
            "can_sync": false,
            "price": 100
        },
        {
            "id": 2,
            "name": "basic",
            "allowed_project_count": 1,
            "person_per_project": 1,
            "duration_days": 365,
            "can_incident": false,
            "can_sync": false,
            "price": 50
        }
    ]
}
 *
 */

const list = async (request, response) => {

    const accountTypes = await listService();
    return ok(response, accountTypes);

};

module.exports = list;
