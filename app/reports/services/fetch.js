const _ = require('lodash');
const { fetch, fetchAll } = require('../../../core/db/postgresql');
const  {getCategoryNames } = require('../../categories/services/list');


const fetchReportById = async (id) => {
    const report = await fetch({
        text: `SELECT id, user_id
        FROM reports
        WHERE id = $1 AND is_deleted = FALSE `,
        values: [id]
    });
    return report;
};

const getReportDetails = async (id) => {
    const answers = await fetchAll({
        text: `
            select
                a.*,
                q.list_order,
                q.title,
                q.paragraph,
                q.category_id,
                o.option,
                o.is_correct_choice
            from answers a
            inner join questions q on q.id = a.question_id
            inner join options o on o.id = a.option_id
            inner join categories c on c.id = q.category_id
            where
                report_id = $1
            order by c.id, q.list_order, q.id asc
        `,
        values: [id],
    });

    const answerIds = answers.map((answer) => answer.id);

    const images = await fetchAll({
        text: 'select * from answer_images where answer_id = ANY($1)',
        values: [answerIds],
    });

    const voices = await fetchAll({
        text: 'select * from answer_voices where answer_id = ANY($1)',
        values: [answerIds],
    });
    const categoryNames = await getCategoryNames();

    const answerFullDetails = answers.map((answer) => ({
        ...answer,
        category: categoryNames.find((category) => category.id === answer.category_id).name,
        images: images.filter((image) => image.answer_id === answer.id),
        voices: voices.filter((voice) => voice.answer_id === answer.id),
    }));


    const groupedAnswer = Object.entries(_.groupBy(answerFullDetails, 'category'))
        .map(([key, value]) => ({
            category: key,
            answers: value,
        }));
    return {answers: groupedAnswer}
};

const fetchReport = async (id) => {
    const reports = (await fetchAll({
        text: `
        WITH RECURSIVE reports_temp AS (
            SELECT reports.*
            FROM reports
            WHERE reports.id = $1
            UNION ALL
            SELECT r.*
            FROM reports r
                INNER JOIN reports_temp rt
                ON rt.id = r.parent_id
        )
        SELECT *
        from reports_temp
        ORDER BY creation_date DESC
        `,
        values: [id],
    }));
    
    reportRecords = Promise.all(reports.map(myfunc = async (report) =>{
        const answers = await getReportDetails(report.id);
        return {
            ...report,
            ...answers
        };
    }));

    
    return reportRecords;
};

module.exports = {
    fetchReportById,
    fetchReport
};
