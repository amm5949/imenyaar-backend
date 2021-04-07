const createService = require('../services/create');
const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const createSchema = require('../schemas/create');

const create = async (request, response) => {
    const { body } = request;
    const result = validator(createSchema, body);
    if (result.failed) {
        return result.response(response);
    }
    if (!(await createService.getUser(body.phoneNumber))) {
        return error(response, 400, {
            en: 'phone number is already registered.',
        });
    }
    if (!(await createService.getAccountType(body.accountTypeID))) {
        return error(response, 400, {
            en: 'invalid account type id',
        });
    }
    const user = (await createService.createUser(body)).rows[0];
    return ok(response, user, { en: 'user created' }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await create(request, response);
    } catch (err) {
        return next(err);
    }
};
