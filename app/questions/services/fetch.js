const db = require('../../../core/db/postgresql');

const getQuestions = async (id) => {
    const question = await db.fetch({
        text: 'SELECT * FROM questions WHERE id=$1',
        values: [id],
    });

    if (question === undefined) {
        return { data: null, error: 'question not found' };
    }

    const options = await db.fetchAll({
        text: 'select * from options where question_id = $1',
        values: [id],
    });

    const images = await db.fetchAll({
        text: 'select * from question_images where question_id = $1',
        values: [id],
    });

    const links = await db.fetchAll({
        text: 'select * from links where option_id = ANY($1)',
        values: [options.map((option) => option.id)],
    });

    const { name: categoryName } = await db.fetch({
        text: 'SELECT * FROM categories WHERE id=$1',
        values: [question.category_id],
    });

    const data = {
        ...question,
        category_name: categoryName,
        images: images.filter((image) => image.question_id === question.id),
        options: options.filter((option) => option.question_id === question.id)
            .map((option) => ({
                ...option,
                links: links.filter((link) => link.option_id === option.id),
            })),
    };
    return { data, error: null };
};

module.exports = {
    getQuestions,
};
