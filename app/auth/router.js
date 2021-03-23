const controllers = require('./controllers');

module.exports = (app, router) => {
    // add routes here
    router.post('/api/login', controllers.login);
};
