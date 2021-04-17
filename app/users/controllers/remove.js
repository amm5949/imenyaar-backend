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
    const user = await removeService.fetchUser(id);
    if (user === undefined) {
        return error(request, 404, {
            en: 'user not found',
            fa: 'کاربر یافت نشد',
        });
    }
    if (user.id !== request.user.id && request.user.role !== 'admin') {
        return error(response, 401, { en: 'Unauthorized' });
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
