const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');
const createService = require('../services/create');

/**
 * @api {post} /api/questions Create
 * @apiGroup Questions
 * @apiName CreateQuestion
 * @apiVersion 1.0.0
 * @apiDescription Create a new question and its options
 * @apiParam {string} title Title
 * @apiParam {string} paragraph Paragraph
 * @apiParam {number} category_id Category ID
 * @apiParam {number} [list_order=count*100] order (priority) among category questions,
 * use list_order api to get available numbers.
 * @apiParam {boolean} [has_correct_choice] Defines that the question has correct choice.
 * default is true. send `options.is_correct_choice` in any case.
 * @apiParam {object[]} options An array of options
 * @apiParam {string} options.option  Title of options
 * @apiParam {boolean} options.is_correct_choice Is correct choice
 * @apiParam {object[]} definitions An array of definitions
 * @apiParam {string} definitions.title  Title of definition
 * @apiParam {string} definitions.text Text of definition
 * @apiParam {number[]} links Option ids that link to this question.
 * @apiSuccessExample success-example:{
    "status": "ok",
    "message": {
        "en": "Question successfully created",
        "fa": "سوال با موفقیت ایجاد شد"
    },
    "result": {
        "id": 37,
        "title": "first added question",
        "paragraph": "some long text",
        "category_id": 1,
        "is_base": false
    }
}
 * @apiParamExample {json} request-example:{
    "title": "first added question",
    "paragraph": "some long text",
    "category_id": 1,
    "order": 525,
    "options": [
        {
            "option": "option 1",
            "is_correct_choice": false
        },
        {
            "option": "option 2",
            "is_correct_choice": false
        },
        {
            "option": "option 3",
            "is_correct_choice": true,
        }
    ],
    "links": [
        23,
        44
    ],
    "definitions": [
        {
            "title": "Def-1",
            "text": "Def-1-Text"
        }
    ]
}
 */
const create = async (request, response) => {
    const createValidator = validator(createSchema, request.body);
    if (createValidator.failed) {
        return createValidator.response(response);
    }
    const { data } = createValidator;
    const category = await createService.fetchCategories(data.category_id);
    if (!category) {
        return error(response, 404, {
            en: 'No such category exists',
            fa: 'دسته بندی داده شده وجود ندارد',
        });
    }
    data.isBase = data.links.length === 0;
    const question = await createService.createQuestion(data);
    return ok(response, question, {
        en: 'Question successfully created',
        fa: 'سوال با موفقیت ایجاد شد',
    });
};

module.exports = async (request, response) => {
    await create(request, response);
};
