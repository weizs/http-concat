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
        base: options.base || path.join(__dirname, '../..'),
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
                var pathArray = validPath(path.join(opts.base, patten[0]), patten[1].split('?')[0].split(opts.fileSeparator));
                if (pathArray.length) {
                    res.setHeader('Content-Type', parseMIME(pathArray[0]));
                    if (opts.setHeaders) {
                        opts.setHeaders(res);
                    }
                    pipe(pathArray, res);
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
    var validPathArray = [], validPathMap = {}, validPath;
    for (var i = 0; i < pathArray.length; i++) {
        validPath = path.join(base, pathArray[i]);
        if (!validPathMap[validPath] && fs.existsSync(validPath)) {
            validPathMap[validPath] = 1;
            validPathArray.push(validPath);
        }
    }
    return validPathArray;
}

function pipe(pathArray, writer) {
    if (pathArray.length) {
        var reader = fs.createReadStream(pathArray.shift(), {encoding: 'utf-8'});
        reader.pipe(writer, {end: false});
        reader.on('end', function () {
            pipe(pathArray, writer);
        });
    } else {
        writer.end();
    }
}