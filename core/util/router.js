module.exports = (app, middleware) => {
    /**
     * If you pass the p2 param it assums that p1 is some middleware.
     */
    const make = (method) => (route, p1, p2) => {
        let controller = p1;
        let mw = [middleware];
        if (p2 !== undefined) {
            controller = p2;
            mw = [...mw, ...p1];
        }
        app[method](route, mw, (req, res, next) => {
            if (!controller) {
                return next('Define the controller');
            }
            return controller(req, res).catch((err) => {
                next({ error: err, code: 500 });
            });
        });
    };
    return {
        get: make('get'),
        post: make('post'),
        delete: make('delete'),
        put: make('put'),
    };
};
