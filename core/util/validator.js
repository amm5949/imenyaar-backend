const validate = require('@alxgh/validate');
const { errorAndAdditionalInfo } = require('./response');

module.exports = (schema, data) => {
    const { output, errors, failed } = validate(schema, data);

    return {
        failed,
        data: output,
        errors,
        response: (response) => errorAndAdditionalInfo(
            response, 422, { en: 'Error in input validation!', fa: 'خطا در اعتبار سنجی داده های ورودی!' }, errors,
        ),
    };
};
