const controllers = require('./controllers');

module.exports = (app, router) => {
    app.post('/api/reports', controllers.create);
    app.get('/api/reports/:id', controllers.fetch);
    app.get('/api/reports', controllers.list);    
    router.post('/api/reports/:id/files', controllers.files);
};
