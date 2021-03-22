// Run pormises serially
const concat = (list) => Array.prototype.concat.bind(list);
const promiseConcat = (f) => (x) => f().then(concat(x));
const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
const serial = (funcs) => funcs.reduce(promiseReduce, Promise.resolve([]));

module.exports = {
    serial,
};
