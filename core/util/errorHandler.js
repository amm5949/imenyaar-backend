const debug = require('debug')('error');
const fs = require('fs');
const dateformat = require('dateformat');
const { error } = require('./response');

// eslint-disable-next-line no-unused-vars
exports.errorHandler = async (err, req, res, next) => {
    // eslint-disable-next-line no-console
    // console.log(err);
    let code = 500;

    if (Object.prototype.hasOwnProperty.call(err, 'code')
            && Object.prototype.hasOwnProperty.call(err, 'error')) {
        code = err.code;
        // eslint-disable-next-line no-param-reassign
        err = err.error;
    }
    const date = dateformat(new Date(), 'yyyy-mm-dd');
    // eslint-disable-next-line no-console
    debug(err);
    // Log the error
    fs.appendFileSync(`./logs/${date}.txt`,
        `${new Date()}: ${err.stack ? err.stack : err}\n`, 'utf8');

    // Send 500 error to client
    return error(res, code, { en: 'something unexpected happend.' });
};
