const fs = require('fs');
const dateformat = require('dateformat');
const { error: errorResponse } = require('./response');

// eslint-disable-next-line no-unused-vars
exports.errorHandler = async ({ error, code }, req, res, next) => {
    // eslint-disable-next-line no-console

    const date = dateformat(new Date(), 'yyyy-mm-dd');
    // Log the error
    fs.appendFileSync(`./logs/${date}.txt`,
        `${new Date()}: ${error.stack ? error.stack : error}\n`, 'utf8');

    // Send 500 error to client
    return errorResponse(res, code, {
        fa: 'اتفاق ناخواسته ای سمت سرور رخ داد.',
        en: 'Something unexpected happend.',
    });
};
