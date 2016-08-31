import express from 'express'
import path from 'path'

import {Schema} from './data/schema';
import graphQLHTTP from 'express-graphql';

import multer from 'multer';
import fs from 'fs'

import _ from 'lodash';
import sanitize from 'sanitize-filename';

const server_port = process.env.PORT || 3000;

var app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../src/frontend/index.html"));
});

app.use('/style', express.static(path.resolve(__dirname, '../src/style')));
app.use('/utils', express.static(path.resolve(__dirname, '../src/utils')));
app.use('/public', express.static(path.resolve(__dirname, '../src/public')));
app.use('/images', express.static(path.resolve(__dirname, '../images')));

app.get('/bundle.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../src/frontend/public/bundle.js"));
});

const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage: storage }).fields([{name: 'file'}]);
const uploadMiddleWare = (req, res, next) => {
    multerMiddleware(req, res, () => {
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
        const files = _.values(req.files);

        if (!files || files.length === 0) {
            next();
            return;
        }

        // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
        req.body.variables = JSON.parse(req.body.variables);

        files.forEach(fileArray => {
            const file = fileArray[0];
            const filename = sanitize(file.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));

            // save file to disk
            const filePath = path.join(__dirname, '../images', filename);
            fs.writeFileSync(filePath, file.buffer);

            // add files to graphql input. we only support single images here
            req.body.variables.input_0[file.fieldname] = '/images/'+filename;
        });

        next();
    });
};

app.use('/graphql', uploadMiddleWare);

app.use('/graphql', graphQLHTTP(req => {
    return {
        schema: Schema,
        pretty: true,
        graphiql: true
    }
}));

app.listen(server_port, (err) => {
    if(err) return console.log(err);
    console.log('Server is now running on port ' + server_port);
});



