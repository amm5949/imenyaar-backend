const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/reports', controllers.create);
    router.get('/api/reports/:id', controllers.fetch);
    router.get('/api/reports', controllers.list);    
    router.post('/api/reports/:id/files', controllers.files);
};
