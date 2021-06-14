const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/activities', controllers.create);
    router.get('/api/activities/:id', controllers.fetch);
    router.get('/api/activities', controllers.list);
    router.put('/api/activities/:id', controllers.update);
    router.delete('/api/activities/:id', controllers.remove);
};
