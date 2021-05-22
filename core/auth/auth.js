const crypto = require('crypto');
const passwordSheriff = require('password-sheriff');
const jwt = require('jsonwebtoken');
const config = require('config');

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365;

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

function signToken(payload, { exp = MINUTE }) {
    const tokenPayload = { ...payload };
    if (!Object.prototype.hasOwnProperty.call(tokenPayload, 'exp')) {
        const currentTime = parseInt((new Date()).getTime() / 1000, 10);
        tokenPayload.exp = currentTime + exp;
    }
    return jwt.sign(tokenPayload, PRIVATEKEY);
}

function hasAccess(request) {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    if (authHeader) {
        const authHeaderSplit = authHeader.split(' ');
        const authType = authHeaderSplit[0];
        const authToken = authHeaderSplit[1];
        if (authType === 'Bearer') {
            return validateToken(authToken);
        }
    }
    return {
        payload: null,
        verify: false,
    };
}

function validateToken(token) {
    try {
        const payload = jwt.verify(token, PRIVATEKEY);
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
}

/**
 * Create an access token.
 * @param {Object} payload Payload of token.
 * @param {int} exp Expiration time in seconds.
 */

exports.createHash = createHash;
exports.verifyPassword = verifyPassword;
exports.signToken = signToken;
exports.hasAccess = hasAccess;
exports.genRandomString = genRandomString;
exports.MINUTE = MINUTE;
exports.HOUR = HOUR;
exports.DAY = DAY;
exports.YEAR = YEAR;
exports.validateToken = validateToken;
