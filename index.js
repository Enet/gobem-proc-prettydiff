'use strict';

var prettydiff = require('prettydiff'),
    redis = require('redis'),
    re = /^\s*\/?\/?(\*|'|"|)\s*prevent\sprettydiff\s*\1\/?;?\s*$/m;

module.exports = function () {
    let client,
        key = 'gobem-proc-prettydiff';

    return {
        before: function (next) {
            client = redis.createClient();
            client.expire(key, 86400);
            next();
        },

        process: function (next, input, output, args, content, path) {
            if (!content) return next();
            client.hget(key, content, function (error, reply) {
                if (reply === null) {
                    try {
                        output.set(path, re.test(content) ? content : prettydiff.api({
                            mode: 'minify',
                            lang: 'auto',
                            report: false,
                            source: content
                        })[0]);
                        client.hset(key, content, output.get(path), next);
                    } catch (error) {
                        output.set(path, content);
                        next(~args.indexOf('ignore-errors') ? null : error);
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
