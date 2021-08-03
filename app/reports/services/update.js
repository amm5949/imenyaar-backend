const db = require('../../../core/db/postgresql');
const subscriptionService = require('../../subscription/services/check');

const update = async (data, parent_id) => {
    let errors;
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
        correctness_percent: reportCorrectness,
        parent_id: parent_id
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
    // update linked image and voice answer ids
    await Promise.all(imageData.map((image) => {
        db.updateQuery('answer_images', 
        {answer_id: image.answer_id},
        {id: image.id})
    }));

    // this could be checked in files.js 
    // but that requires checking which project the user is pushing into
    // can be modified in future versions.
    // a better practice is checking user's access *before* uploading files separately.
    if(voiceData.length) {
        const userRole = await db.fetch({
            text: `SELECT r.id, r.name as name FROM user_roles ur
                    INNER JOIN roles r on ur.role_id = r.id
                    WHERE ur.user_id = $1
                    ORDER BY r.id ASC`,
            values: [data.user_id]
        });
        const projectId = (await db.fetch({
            text: `SELECT project_id FROM reports r 
            INNER JOIN activities a ON a.id = r.activity_id 
            WHERE r.id = $1`,
            values: [report.id]
        })).project_id;

        const canVoice = (
            userRole.name === 'admin' 
            || await subscriptionService.checkByUser(data.user_id, 'can_send_voice', {project_id: projectId})
        );
        if (canVoice){
            await Promise.all(voiceData.map((voice) => {
                db.updateQuery('answer_voices', 
                {answer_id: voice.answer_id},
                {id: voice.id})
            }));
        }
        else {
            errors = 'cannot attach voice files.';
        }
    }
    
    const res = Object.assign ({
        report,
        answers: answersRes
    },        
    errors && {errors},
    );
return res;
};

module.exports = update;
