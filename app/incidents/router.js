const controllers = require('./controllers');

// eslint-disable-next-line no-unused-vars
module.exports = (app, router) => {
    router.post('/api/incidents', controllers.create);
    router.get('/api/incidents', controllers.list);
    router.get('/api/incidents/fetch/:incident_id', controllers.fetch);
    router.put('/api/incidents/:id', controllers.update);
};
