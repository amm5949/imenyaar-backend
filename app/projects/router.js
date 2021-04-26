const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/projects/addpeople/:id', controllers.add_people);
    router.post('/api/projects', controllers.create);
    router.get('/api/projects/:id', controllers.fetch);
    router.get('/api/projects', controllers.list);
    router.put('/api/projects/:id', controllers.update);
    router.delete('/api/projects/:id', controllers.remove);
};
