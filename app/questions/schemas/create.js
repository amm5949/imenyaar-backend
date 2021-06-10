/* eslint-disable quote-props */
module.exports = {
    'title': 'string',
    'category_id': 'integer',
    'list_order?': 'integer',
    'paragraph': 'string',
    'has_correct_choice?': 'boolean',
    'options': 'array',
    'options.*.option': 'string',
    'options.*.is_correct_choice': 'boolean',
    'links': 'array',
    'links.*': 'integer',
};
