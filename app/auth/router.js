const controllers = require('./controllers');

// eslint-disable-next-line no-unused-vars
module.exports = (app, router) => {
    app.post('/api/auth/login', controllers.login);
};
