const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/subscription', controllers.create);
    router.post('/api/subscription/buy/:id', controllers.request);
    router.get('/api/subscription/verify/:id', controllers.verify);
    router.put('/api/subscription/types/:id', controllers.update);
    app.get('/api/subscription/types/:id', controllers.fetch);
    app.get('/api/subscription/types', controllers.list);
    // router.delete('/api/subscription/types/:id', controllers.remove);
};
