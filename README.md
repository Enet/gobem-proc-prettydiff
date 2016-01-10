# gobem-proc-prettydiff
This processor for [gobem](https://github.com/Enet/gobem) minifies files using **prettydiff**. All options are passed as a single object. Empty files are just skipped during processing. **gobem-proc-prettydiff** requires directory to cache results of the work.

The following options are supported:
* `ignoreErrors`<br>
If this flag is `true` and error occured, raw file's content will be written instead minified one.
* `cacheDir`<br>
Full path to a readable and writable directory to cache files.

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
