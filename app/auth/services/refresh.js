const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

module.exports = async (refreshToken) => {
    const { payload, verify } = auth.validateToken(refreshToken);

    if (!verify) {
        return {
            tokens: [],
            err: true,
        };
    }

    const { token, id: userId, session_id: sessionId } = payload;
    const record = await db.fetch({
        text: 'select id, user_id, uuid from sessions where token = $1 and user_id = $2 and uuid = $3',
        values: [token, userId, sessionId],
    });

    if (record === undefined) {
        return {
            tokens: [],
            err: true,
        };
    }
    const refreshTokenVal = auth.genRandomString(32);
    await db.updateQuery('sessions', {
        token: refreshTokenVal,
    }, {
        id: record.id,
    });

    const accessToken = auth.signToken({
        id: userId,
        session_id: sessionId,
    }, { exp: auth.MINUTE });

    const newRefreshToken = auth.signToken({
        id: userId,
        session_id: sessionId,
        token: refreshTokenVal,
    }, { exp: auth.YEAR });
    return {
        tokens: {
            access_token: accessToken,
            refresh_token: newRefreshToken,
        },
        err: false,
    };
};
