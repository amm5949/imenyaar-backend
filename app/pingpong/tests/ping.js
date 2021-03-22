var expect = require('chai').expect;

describe('ping', function() {
    it('Ping is not pong!', function(done) {
        const ping = 'ping';

        expect(ping).not.to.equal('pong');

        done();
    });
});