const { ok, error } = require('../../../core/util/response');
const listService = require('../services/list');

/**
 * @api {get} /api/categories List
 * @apiName ListCategories
 * @apiGroup Categories
 * @apiVersion 1.0.0
 * @apiDescription returns all top categories and their children in a recursive manner
 * @apiSuccessExample successExample:
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": [
        {
            "id": 1,
            "name": "1st",
            "children": [
                {
                    "id": 4,
                    "name": "4th",
                    "children": [
                        {
                            "id": 10,
                            "name": "10th",
                            "children": []
                        },
                        {
                            "id": 11,
                            "name": "11th",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "5th",
                    "children": []
                },
                {
                    "id": 6,
                    "name": "6th",
                    "children": []
                }
            ]
        },
        {
            "id": 2,
            "name": "2nd",
            "children": [
                {
                    "id": 7,
                    "name": "7th",
                    "children": []
                },
                {
                    "id": 8,
                    "name": "8th",
                    "children": []
                }
            ]
        },
        {
            "id": 3,
            "name": "3rd",
            "children": [
                {
                    "id": 9,
                    "name": "9th",
                    "children": [
                        {
                            "id": 12,
                            "name": "12th",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
}
 */

module.exports = async (request, response, next) => {
    let allCategories = await listService.get();
    let categories = getTop(allCategories);
    for (let i = 0; i < categories.length; i++) {
        categories[i].children = getChildren(allCategories, categories[i].id);
    }
    ok(response,categories,{},200);
};

function getTop(allCategories) {
    let top = [];
    for (let c of allCategories) {
        if (c.parent_id === null) {
            top.push({id:c.id,name:c.name});
        }
    }

    return top;
}

function getChildren(allCategories, id) {
    let children = [];
    let count = 0;
    for (let c of allCategories) {
        if (c.parent_id === id) {
            children.push({id:c.id,name:c.name});
            children[count].children = getChildren(allCategories, c.id);
            count++;
        }
    }
    return children;
}
