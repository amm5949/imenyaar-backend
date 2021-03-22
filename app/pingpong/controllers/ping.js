module.exports = async (request, response, next) => {
    try {
        throw new Error('oh no!');
    } catch (err) {
        return next({ error: err, code: 500 });
    }
};
