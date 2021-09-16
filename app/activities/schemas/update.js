module.exports = {
    'name': ['string', 'length:min,1', 'length:max,64'],
    'zones': 'array',
    'zones.*': 'number',
    'people?': 'array',
    'people.*': 'number',
    'status?' : [(val) => {
            if ((typeof val.input) === 'number' && (val.input > 0 && val.input < 11)) {
            return {
                result: true,
            };
        }
        return {
            result: false,
            message: 'status must be a number between 1 and 10, each representing a state',
        }        
    }],
    'start_date?': 'string',
    'scheduled_end_date?': 'string',
    'is_done?': 'boolean',
};

