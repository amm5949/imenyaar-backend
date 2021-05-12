const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

module.exports = (refreshToken) => {
    const { payload, verify } = auth.validateToken(refreshToken);

    if (!verify) {
        return {
            tokens: [],
            err: true,
        };
    }

    const { token, id, session_id: sessionId } = payload;
    return db.executeQuery({
        text: 'delete from sessions where token = $1 and user_id = $2 and uuid = $3',
        values: [token, id, sessionId],
    });
};
