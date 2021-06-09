const controllers = require('./controllers');

module.exports = (app, router) => {
    app.post('/api/categories', controllers.create);
    app.get('/api/categories', controllers.list);    
};
