const db = require('../../../core/db/postgresql');

const getCategoryNames = async () => {
    const categories = await db.fetchAll({
        text: 'select * from categories order by id',
    });

    const loopThroughParents = ({ name, parentId }, array) => {
        if (parentId == null) {
            return name;
        }
        const parent = array.find((el) => el.id === parentId);

        const parentName = loopThroughParents(
            { name: parent.name, parentId: parent.parent_id },
            array,
        );
        return `${parentName}-${name}`;
    };

    return categories.map(({ name, ...categoryData }, _idx, array) => {
        const fullName = loopThroughParents({ name, parentId: categoryData.parent_id }, array);
        return {
            ...categoryData,
            name: fullName,
        };
    });
};

const getQuestions = async (categoryIDs, optionID) => {
    const categoryNames = await getCategoryNames();

    const categories = (await db.fetchAll({
        text: `
            WITH RECURSIVE categories_temp AS (
                SELECT categories.*, t.ord
                FROM categories
                         LEFT JOIN unnest($1::Int[])
                    WITH ORDINALITY AS t(id, ord) USING (id)
                WHERE categories.id = ANY ($1)
                UNION ALL
                SELECT s.*, t.ord
                FROM categories s
                         INNER JOIN categories_temp st
                         LEFT JOIN unnest($1::Int[])
                    WITH ORDINALITY AS t(id, ord) USING (id)
                                   ON st.id = s.parent_id
            )
            SELECT *
            from categories_temp
            ORDER BY ord, id
        `,
        values: [categoryIDs],
    })).map((category) => category.id);

    const query = {
        text: `
            select *
            from questions
                     JOIN unnest($1::int[]) WITH ORDINALITY t(category_id, ord) USING (category_id)
            where category_id = ANY ($1)
            ORDER BY t.ord, questions.list_order, questions.id
            ;
        `,
        values: [categories],
    };
    const queryBasedOnOptionLink = {
        text: `
            select q.*
            from questions q
                     inner join links l on l.question_id = q.id
            where q.is_base = false
              and l.option_id = $1
        `,
        values: [optionID],
    };

    const questions = await db.fetchAll(
        categoryIDs ? query : queryBasedOnOptionLink,
    );

    const questionIds = questions.map((question) => question.id);

    const options = await db.fetchAll({
        text: 'select * from options where question_id = ANY($1)',
        values: [questionIds],
    });

    const images = await db.fetchAll({
        text: 'select * from question_images where question_id = ANY($1)',
        values: [questionIds],
    });

    const links = await db.fetchAll({
        text: 'select * from links where option_id = ANY($1)',
        values: [options.map((option) => option.id)],
    });

    return questions.map((question) => ({
        ...question,
        category_name: categoryNames.find((category) => category.id === question.category_id).name,
        images: images.filter((image) => image.question_id === question.id),
        options: options.filter((option) => option.question_id === question.id)
            .map((option) => ({
                ...option,
                links: links.filter((link) => link.option_id === option.id),
            })),
    }));
};

module.exports = {
    getQuestions,
};
