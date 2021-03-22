controllers = require('./controllers');

module.exports = (app, router) => {
    app.get('/ping', controllers.ping);
    app.get('/pong', controllers.pong);
};