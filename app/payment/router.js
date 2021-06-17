const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/subscription', controllers.create);
    router.post('/api/subscription/buy', controllers.buy);
    router.post('/api/subscription/verify', controllers.verify);
    router.put('/api/subscription/type/:id', controllers.update);
    router.get('/api/subscription/type/:id', controllers.fetch);
    router.get('/api/subscription/type', controllers.list);
    router.delete('/api/subscription/type/:id', controllers.remove);
};
