/**
 * Created by William on 2016/8/18.
 */
var fs = require('fs');
var path = require('path');

var MIME = {
    '.css': 'text/css;charset=utf-8',
    '.js': 'application/javascript;charset=utf-8'
};

var httpConcat = function (options) {

    options = options || {};

    var opts = {
        //file base path
        base: options.base || '/public',
        //url path
        path: options.path || '/',
        //separator for url path & file path
        separator: options.separator || '??',
        //separator for file path
        fileSeparator: options.fileSeparator || ',',
        //setHeaders callback
        setHeaders: options.setHeaders
    };

    return function httpConcat(req, res, next) {
        if (req.url.indexOf(opts.path) === 0) {
            var patten = req.url.split(opts.separator);
            if (patten.length < 2) {
                next();
            } else {
                var pathArrayStr = patten[1].split('?')[0],
                    pathArray = validPath(opts.base, pathArrayStr ? pathArrayStr.split(opts.fileSeparator) : []);
                if (pathArray.length) {
                    res.setHeader('Content-Type', parseMIME(pathArray[0]));
                    if (opts.setHeaders) opts.setHeaders(res);
                    outputFiles(pathArray, res);
                } else {
                    res.status(404);
                    next();
                }
            }
        } else {
            next();
        }
    };
};

module.exports = httpConcat;

function parseMIME(filename) {
    return MIME[path.extname(filename)] || 'text/plain;charset=utf-8';
}

function validPath(base, pathArray) {
    var validPathArray = [], tmpPath;
    for (var i = 0; i < pathArray.length; i++) {
        tmpPath = base + '/' + pathArray[i];
        if (fs.existsSync(tmpPath))
            validPathArray.push(tmpPath);
    }
    return validPathArray;
}

function outputFiles(pathArray, writer) {
    (function next(i, len) {
        if (i < len) {
            var reader = fs.createReadStream(pathArray[i], {encoding: 'utf-8'});
            reader.pipe(writer, {end: false});
            reader.on('end', function () {
                next(i + 1, len);
            });
        } else {
            writer.end();
        }
    }(0, pathArray.length));
}