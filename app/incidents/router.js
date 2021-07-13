const controllers = require('./controllers');

// eslint-disable-next-line no-unused-vars
module.exports = (app, router) => {
    app.post('/api/incidents', controllers.create);
    app.get('/api/incidents/list/:zone_id', controllers.list);
    app.get('/api/incidents/fetch/:incident_id', controllers.fetch);
    app.put('/api/incidents/:id', controllers.update);
};
