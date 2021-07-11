const db = require('../../../core/db/postgresql');

const create = async (data) => {
    const { answers, ...reportData } = data;

    const optionIds = answers.map((answer) => answer.option_id);

    const shouldCalcOptionsCount = await db.fetch({
        text: `SELECT count(*) 
        FROM options o INNER JOIN questions q ON q.id = o.question_id 
        WHERE o.id = ANY($1) AND q.has_correct_choice = true`,
        values: [optionIds],
    });

    const reportCorrectness = (await db.fetchAll({
        text: `
            SELECT
                o.is_correct_choice,
                q.has_correct_choice
            FROM options o
            INNER JOIN questions q ON q.id = o.question_id
            WHERE o.id = ANY($1) AND o.is_correct_choice = true AND q.has_correct_choice = true
        `,
        values: [optionIds],
    })).length / shouldCalcOptionsCount.count;


    const report = await db.insertQuery('reports', {
        ...reportData,
        correctness_percent: reportCorrectness
    });

    const answersData = answers.map((answer) => ({
        question_id: answer.question_id,
        option_id: answer.option_id,
        description: answer.description, 
        report_id: report.id,
    }));

    const answersRes = await db.insertQuery('answers', answersData);
    // append answer id to initial answer data (to use with file insertions)
    const answerFiles = answers.map((item, i) => 
        Object.assign({}, item, answersRes[i]));

    const imageData = answerFiles.flatMap((answer) => (
        answer.image_ids.map(function(imageId) {
            return {
                id: imageId,
                answer_id: answer.id
            };        
        })
    ));
    const voiceData = answerFiles.flatMap((answer) => (
        answer.voice_ids.map(function(voiceId) {
            return {
                id: voiceId,
                answer_id: answer.id
            };        
        })
    ));

    await Promise.all(imageData.map((image) => {
        db.updateQuery('answer_images', 
        {answer_id: image.answer_id},
        {id: image.id})
    }));

    await Promise.all(voiceData.map((voice) => {
        db.updateQuery('answer_voices', 
        {answer_id: voice.answer_id},
        {id: voice.id})
    }));
    
    return {
        report,
        answers: answersRes
    };
};

module.exports = create;
