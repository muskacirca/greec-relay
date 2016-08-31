#!/bin/env node
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _schema = require('./data/schema');

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server_port = process.env.PORT || 3000;

var app = (0, _express2.default)();

app.get('/', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, "../src/frontend/index.html"));
});

app.use('/style', _express2.default.static(_path2.default.resolve(__dirname, '../src/style')));
app.use('/utils', _express2.default.static(_path2.default.resolve(__dirname, '../src/utils')));
app.use('/public', _express2.default.static(_path2.default.resolve(__dirname, '../src/public')));
app.use('/images', _express2.default.static(_path2.default.resolve(__dirname, '../images')));

app.get('/bundle.js', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, "../lib/bundle.js"));
});

var storage = _multer2.default.memoryStorage();
var multerMiddleware = (0, _multer2.default)({ storage: storage }).fields([{ name: 'file' }]);
var uploadMiddleWare = function uploadMiddleWare(req, res, next) {
    multerMiddleware(req, res, function () {
        // request contains file data in req.files in format
        // {
        //   key: [{
        //     fieldname,
        //     originalname,
        //     encoding,
        //     mimetype,
        //     buffer,
        //     size
        //   }]
        // }

        // convert to array in format
        // [
        //   [fieldname, originalname ...]
        // ]
        var files = _lodash2.default.values(req.files);

        if (!files || files.length === 0) {
            next();
            return;
        }

        // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
        req.body.variables = JSON.parse(req.body.variables);

        files.forEach(function (fileArray) {
            console.log("there's a file");
            var file = fileArray[0];
            var filename = (0, _sanitizeFilename2.default)(file.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));

            // save file to disk
            var filePath = _path2.default.join(__dirname, '../images', filename);
            _fs2.default.writeFileSync(filePath, file.buffer);

            // add files to graphql input. we only support single images here
            req.body.variables.input_0[file.fieldname] = '/images/' + filename;
        });

        next();
    });
};

app.use('/graphql', uploadMiddleWare);

app.use('/graphql', (0, _expressGraphql2.default)(function (req) {
    return {
        schema: _schema.Schema,
        pretty: true,
        graphiql: true
    };
}));

app.listen(server_port, function (err) {
    if (err) return console.log(err);
    console.log('Server is now running on port ' + server_port);
});