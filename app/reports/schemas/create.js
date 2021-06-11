module.exports = {
    creation_date: 'string',
    activity_id: 'number',
    zone_id: 'number',
    answers: 'array',
    'answers.*.question_id': 'integer',
    'answers.*.option_id': 'integer',
    'answers.*.description': 'string',
};
