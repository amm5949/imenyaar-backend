const auth = require('../auth/auth.js');
const db = require('../db/postgresql');

module.exports = async (req, res, next) => {
    const data = auth.hasAccess(req);
    // Global routes will bypass the access check.
    const { path } = req.route;
    const method = req.route.methods;
    // return next();
    if (data.verify === false) {
        return next(
            {
                error: 'Invalid access',
                code: 401,
            },
        );
    }

    const user = await db.fetch({
        text: `
            SELECT first_name, last_name, phone_number, id, (
                select array_to_json(array_agg(row_to_json(d)))
                from (
                    SELECT roles.name as name, roles.id, (
                        SELECT array_to_json(array_agg(row_to_json(r))) from (
                            SELECT resources.url, resources.method from accesses, resources WHERE accesses.role_id = roles.id AND resources.id = accesses.resource_id
                        ) r
                    ) as accesses from user_roles, roles where user_roles.user_id = users.id and roles.id = user_roles.role_id
                ) d
            ) as roles
            from users
            where users.id = $1
        `,
        values: [data.payload.id],
    });
    if (!user) {
        return next(
            {
                error: 'Invalid access',
                code: 401,
            },
        );
    }
    // Attach user to request
    req.user = user;
    // Uncomment line below to skip access check.
    // return next();

    // Check if user has access to this route.
    const hasAccessToResource = user.roles.find(
        ({ accesses }) => accesses.find(
            (access) => access.url === path && Object.prototype.hasOwnProperty.call(
                method, access.method.toLowerCase(),
            ),
        ),
    );

    if (hasAccessToResource) {
        return next();
    }

    // If there is no access send 403 response
    return next(
        {
            error: 'Invalid access',
            code: 403,
        },
    );
};
