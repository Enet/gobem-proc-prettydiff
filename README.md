# gobem-proc-prettydiff
This processor for [gobem](https://github.com/Enet/gobem) minifies files using **prettydiff**. All options are passed as a single object. Empty files are just skipped during processing. **gobem-proc-prettydiff** requires redis database to cache results of the work.

The following options are supported:
* `ignoreErrors`<br>
If this flag is `true` and error occured, raw file's content will be written instead minified one.
* `redisKey`<br>
The key in the redis database to store cache. Default value is `gobem-proc-prettydiff`.
* `redisClient`<br>
Already created redis-client. [This](https://github.com/NodeRedis/node_redis) module is used.
* `redisOptions`<br>
Options for a new redis-client. This field is ignored, if `redisClient` is passed.

Also there is one useful feature: if you don't want to minify some specific file, just add one of the following lines into any place:
* /* prevent prettydiff */
* // prevent prettydiff
* 'prevent prettydiff';
* "prevent prettydiff";

### Example for **build.js**
```javascript
module.exports = function () {
    return [
        ['select', 0, /^components\/(\w+)\/\1\.es2015.js$/],
        ['gobem-proc-prettydiff', {ignoreErrors: true}],
        ['write', 1]
    ]; // this array will be used as build instructions
};
```
