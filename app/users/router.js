const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/users', controllers.create);
    router.get('/api/users/:id', controllers.fetch);
    router.get('/api/users', controllers.list);
    router.put('/api/users/:id', controllers.update);
    router.delete('/api/users/:id', controllers.remove);
};
