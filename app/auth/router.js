const controllers = require('./controllers');

module.exports = (app, router) => {
    app.post('/api/auth/login', controllers.login);
    app.post('/api/auth/register', controllers.register);
    app.post('/api/auth/new-code', controllers.newCode);
    app.post('/api/auth/activate', controllers.activate);
    app.post('/api/auth/ref_register', controllers.refRegister);
    app.post('/api/auth/refresh-token', controllers.refresh);
    app.post('/api/auth/logout', controllers.logout);
};
