const removeService = require('../services/remove');
const { ok, error } = require('../../../core/util/response');


/**
 * @api {delete} /api/users/:id delete
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Delete a user
 */

const remove = async (request, response) => {
    const { id } = request.params;
    if (!(await removeService.fetchUser(id))) {
        return error(request, 404, {
            en: 'user not found',
            fa: 'کاربر یافت نشد',
        });
    }
    await removeService.removeUser(id);
    return ok(response, {}, {
        en: 'user deleted',
        fa: 'کاربر حذف شد',
    }, 200);
};

module.exports = async (request, response, next) => {
    try {
        return await remove(request, response);
    } catch (err) {
        return next(err);
    }
};
