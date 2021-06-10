const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/zones', controllers.create);
    router.get('/api/zones/:id', controllers.fetch);
    router.get('/api/zones', controllers.list);
    router.put('/api/zones/:id', controllers.update);
    router.delete('/api/zones/:id', controllers.remove);
};
