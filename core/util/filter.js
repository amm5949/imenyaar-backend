/**
 * Fitler an object with required fields.
 *
 * @param {object} object object object to be filtered
 * @param {array} fields fields that should be in output
 *
 * @returns (object) filtered object
 */
const filter = (object, fields) => Object.fromEntries(
    Object.entries(object).filter(([field]) => fields.indexOf(field) >= 0),
);

exports.filter = filter;
