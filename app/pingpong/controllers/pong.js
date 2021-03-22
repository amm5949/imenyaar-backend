const { ok } = require('../../../core/util/response');

module.exports = async (request, response, next) => {
    return ok(response, {
        ping: 'So boring...',
    }, {}, 200);
};