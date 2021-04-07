const controllers = require('./controllers');

module.exports = (app, router) => {
    app.post('/api/auth/login', controllers.login);
    app.post('/api/auth/register', controllers.register);
    app.post('/api/auth/new-code', controllers.newCode);
    app.post('/api/auth/activate', controllers.activate);
};
