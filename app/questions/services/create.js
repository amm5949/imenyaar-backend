const db = require('../../../core/db/postgresql');

const fetchCategories = async (id) => db.fetch({
    text: 'SELECT * FROM categories WHERE id=$1',
    values: [id],
});

const fetchQuestionCountInCategory = async (id) => db.fetch({
    text: `SELECT count(q.*)
           FROM questions q
           WHERE category_id=$1`,
    values: [id],
});

const insertQuestion = async (data) => db.insertQuery('questions', {
    title: data.title,
    paragraph: data.paragraph,
    category_id: data.category_id,
    is_base: data.isBase,
    list_order: data.list_order,
    has_correct_choice: data.has_correct_choice || true,
});

const insertOptions = async (questionID, options) => {
    // eslint-disable-next-line no-param-reassign,no-return-assign
    options.forEach((o) => o.question_id = questionID);
    return db.insertQuery('options', options);
};

const insertLinks = async (questionID, links) => {
    const linksWithQuestionId = links.map((optionId) => ({
        option_id: optionId,
        question_id: questionID,
    }));
    return db.insertQuery('links', linksWithQuestionId);
};

const createQuestion = async (data) => {
    if (data.list_order === undefined) {
        const { count } = await fetchQuestionCountInCategory(data.category_id);
        // eslint-disable-next-line no-param-reassign
        data.list_order = (parseInt(count, 10) + 1) * 100;
    }
    const question = await insertQuestion(data);
    await insertOptions(question.id, data.options);
    if (!data.isBase) {
        await insertLinks(question.id, data.links);
    }
    return question;
};

module.exports = {
    fetchCategories,
    createQuestion,
};
