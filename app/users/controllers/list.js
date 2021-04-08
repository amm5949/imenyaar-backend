const listService = require('../services/list');
const { ok } = require('../../../core/util/response');

const list = async (request, response) => {
    const users = await listService.fetchUsers();
    return ok(response, users, {}, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await list(request, response);
    } catch (err) {
        return next(err);
    }
};
