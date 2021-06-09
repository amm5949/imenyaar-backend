const _ = require('lodash');
const { fetch, fetchAll } = require('../../../core/db/postgresql');
const  {getCategoryNames } = require('../../categories/services/list');

const fetchReport = async (id) => {
    const report = await fetch({
        text: `
            select
                rp.*,
                u.first_name,
                u.last_name,
                u.username,
                c.name as category_name
            from reports rp
            inner join users u on u.id = rp.user_id
            inner join categories c on c.id = rp.category_id
            where
                rp.id = $1
                and rp.is_deleted = false
        `,
        values: [id],
    });

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
        values: [report.id],
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

    return {
        ...report,
        answers: groupedAnswer,
    };
};

module.exports = fetchReport;
