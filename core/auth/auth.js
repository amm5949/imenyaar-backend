const crypto = require('crypto');
const passwordSheriff = require('password-sheriff');
const jwt = require('jsonwebtoken');
const config = require('config');

const { PasswordPolicy } = passwordSheriff;

const PRIVATEKEY = process.env.PRIVATEKEY ? process.env.PRIVATEKEY : config.get('JWT_KEY');

exports.passwordPolicy = new PasswordPolicy({
    length: {
        minLength: 6,
    },
});

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
}

function createHash(password, salt) {
    let curSalt = '';
    if (!salt) {
        curSalt = config.get('APP_KEY');
    } else {
        curSalt = salt;
    }

    const curHash = crypto.createHmac('sha512', curSalt).update(password).digest('hex');
    return {
        salt: curSalt,
        passwordHash: curHash,
    };
}

function verifyPassword(password, hash, salt) {
    const calcHash = createHash(password, salt);
    return calcHash.passwordHash === hash;
}

function signToken(payload) {
    return jwt.sign(payload, PRIVATEKEY);
}

function hasAccess(request) {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    if (authHeader) {
        const authHeaderSplit = authHeader.split(' ');
        const authType = authHeaderSplit[0];
        const authToken = authHeaderSplit[1];
        if (authType === 'Bearer') {
            try {
                const payload = jwt.verify(authToken, PRIVATEKEY);
                return {
                    payload,
                    verify: true,
                };
            } catch (err) {
                return {
                    payload: null,
                    verify: false,
                };
            }
        } else {
            return {
                payload: null,
                verify: false,
            };
        }
    } else {
        return {
            payload: null,
            verify: false,
        };
    }
}
exports.createHash = createHash;
exports.verifyPassword = verifyPassword;
exports.signToken = signToken;
exports.hasAccess = hasAccess;
exports.genRandomString = genRandomString;