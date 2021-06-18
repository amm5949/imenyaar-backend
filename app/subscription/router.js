const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/subscription', controllers.create);
    router.post('/api/subscription/buy', controllers.buy);
    router.post('/api/subscription/verify', controllers.verify);
    router.put('/api/subscription/types/:id', controllers.update);
    router.get('/api/subscription/types/:id', controllers.fetch);
    app.get('/api/subscription/types', controllers.list);
    router.delete('/api/subscription/types/:id', controllers.remove);
};
