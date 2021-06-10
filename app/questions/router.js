const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/questions', controllers.create);
    router.get('/api/questions', controllers.list);
};
