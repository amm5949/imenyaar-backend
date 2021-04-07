const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/users', controllers.create);
};
