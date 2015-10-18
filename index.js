'use strict';

var prettydiff = require('prettydiff'),
    redis = require('redis'),
    re = /^\s*\/?\/?(\*|'|"|)\s*prevent\sprettydiff\s*\1\/?;?\s*$/m;

module.exports = function (options) {
    options = options || {};

    let client = options.redisClient,
        key = options.redisKey || 'gobem-proc-prettydiff';

    return {
        before: function (next) {
            client = client || redis.createClient(options.redisOptions);
            client.expire(key, 86400);
            next();
        },

        process: function (next, input, output, config, content, path) {
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
                        next(options.ignoreErrors ? null : error);
                    }
                } else {
                    output.set(path, reply);
                    next();
                }
            });
        },

        clear: function (next) {
            options.redisClient && client.end();
            next();
        }
    };
};
