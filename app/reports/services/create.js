/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


module.exports = async (data) => {
    const record = await db.insertQuery('reports', data);
    return record;
};

const create = async (data) => {
    const { answers, ...reportData } = data;

    const optionIds = answers.map((answer) => answer.option_id);
   
    const report = await db.insertQuery('reports', {
        ...reportData
    });

    const answersData = answers.map((answer) => ({
        ...answer,
        report_id: report.id,
    }));

    await db.insertQuery('answers', answersData);

    return report;
};

module.exports = create;
