const db = require('../../../core/db/postgresql');

const create = async (data) => {
    const { answers, ...reportData } = data;

    // const optionIds = answers.map((answer) => answer.option_id);

    const report = await db.insertQuery('reports', {
        ...reportData,
    });
    const answersData = answers.map((answer) => ({
        ...answer,
        report_id: report.id,
    }));

    const answers_res = await db.insertQuery('answers', answersData);
    return {
        report,
        answers: answers_res
    };
};

module.exports = create;
