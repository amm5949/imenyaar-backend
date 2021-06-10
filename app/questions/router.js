const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/questions', controllers.create);
};
