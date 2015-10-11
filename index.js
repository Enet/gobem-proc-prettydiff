'use strict';

var prettydiff = require('prettydiff'),
    redis = require('redis'),
    re = /^\s*\/?\/?(\*|'|"|)\s*prevent\sprettydiff\s*\1\/?;?\s*$/m;

module.exports = function () {
    let client;

    return {
        before: function (next) {
            client = redis.createClient();
            client.expire('prettydiff', 86400);
            next();
        },

        process: function (next, input, output, args, content, path) {
            if (!content) return next();
            client.hget('prettydiff', content, function (error, reply) {
                if (reply === null) {
                    try {
                        output.set(path, re.test(content) ? content : prettydiff.api({
                            mode: 'minify',
                            lang: 'auto',
                            report: false,
                            source: content
                        })[0]);
                        client.hset('prettydiff', content, output.get(path), next);
                    } catch (error) {
                        output.set(path, content);
                        next(error);
                    }
                } else {
                    output.set(path, reply);
                    next();
                }
            });
        },

        clear: function (next) {
            client.end();
            next();
        }
    };
};
