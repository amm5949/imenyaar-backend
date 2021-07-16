const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/projects/addpeople/:id', controllers.add_people);
    router.post('/api/projects', controllers.create);
    router.get('/api/projects/:id', controllers.fetch);
    router.get('/api/projects/people/:id', controllers.fetch_people);
    router.delete('/api/projects/people/:id', controllers.remove_people);
    router.get('/api/projects', controllers.list);
    router.put('/api/projects/:id', controllers.update);
    router.delete('/api/projects/:id', controllers.remove);
};
