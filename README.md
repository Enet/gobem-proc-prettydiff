# gobem-proc-prettydiff
This processor for [gobem](https://github.com/Enet/gobem) minifies files using **prettydiff**. If an argument `ignore-errors` is passed and error occured, raw file's content will be written instead minified one. Empty files are just skipped.

Also there is one useful feature: if you don't want to minify some specific file, just add one of the following lines into any place:
* /* prevent prettydiff */
* // prevent prettydiff
* 'prevent prettydiff';
* "prevent prettydiff";

**gobem-proc-prettydiff** requires redis database to cache results.

### Example for **build.gb**
```javascript
select 0 ^components\/(\w+)\/\1\.es2015.js$
process gobem-proc-prettydiff ignore-errors
write 1
```
