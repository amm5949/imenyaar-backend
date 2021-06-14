const controllers = require('./controllers');

module.exports = (app, router) => {
    router.post('/api/questions', controllers.create);
    router.get('/api/questions', controllers.list);
    router.post('/api/questions/:id/images', controllers.image);
    router.get('/api/questions/order/:category_id', controllers.order);
    router.put('/api/questions/:id', controllers.update);
    router.delete('/api/questions/:id', controllers.remove);
    router.get('/api/questions/:id', controllers.fetch);
};
