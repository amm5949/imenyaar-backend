/* eslint-disable no-console */
const kavenegar = require('kavenegar');
const config = require('config');

const api = kavenegar.KavenegarApi({
    apikey: config.get('SMS_API_KEY'),
});

exports.send = (template, token, receptor) => {
    api.VerifyLookup({
        template,
        token,
        receptor,
        sender: '1000596446',
    },
    (response, status) => {
        console.log(response);
        console.log(status);
    });
};
