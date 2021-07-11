/* eslint-disable no-console */
const kavenegar = require('kavenegar');
const config = require('config');

const api = kavenegar.KavenegarApi({
    apikey: config.get('SMS_API_KEY'),
});

exports.send = (template, token, receptor) => {
    message = `ایمن یار
    \nکد اعتبارسنجی: ${token}`;
    api.Send({
        receptor: receptor,
        message: message,
        token: "0000000",
        // template: "verify",
        sender: '1000596446',
    },
    (response, status) => {
        console.log(response);
        console.log(status);
    });
};
