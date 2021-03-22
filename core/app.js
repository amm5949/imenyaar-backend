const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./util/errorHandler');

exports.init = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(fileUpload({
        createParentPath: true,
    }));

    app.use(cors());

    // Default passe
    app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.get('/apidoc', (req, res) => {
        res.sendFile(path.join(__dirname, '../apidoc/index.html'));
    });

    app.get('/panel', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/panel/index.html'));
    });
};

exports.run = (app) => {
    console.log(`*** ${String(config.get('LEVEL')).toUpperCase()} ***`);

    app.use('uploads/', express.static(path.join(__dirname, '../uploads'), { fallthrough: false }));
    app.use(express.static(path.join(__dirname, '../apidoc'), { fallthrough: false }));

    app.use(errorHandler);

    app.listen(config.get('PORT'), () => {
        console.log(`server is running on port ${config.get('PORT')}`);
    });
};
