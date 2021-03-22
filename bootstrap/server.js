BASEDIR = `${__dirname}/..`;
process.env.NODE_CONFIG_DIR = `${BASEDIR}/config`;

const fs = require('fs');
const express = require('express');
const routerHelper = require('../core/util/router');
const authMiddleware = require('../core/middleware/authMiddleware')

const app = express();
const handler = require('../core/app');

handler.init(app);

const modules = JSON.parse(
    fs.readFileSync('config/modules.json')
);

const router = routerHelper(app, authMiddleware);

modules.forEach((module) => {
    const moduleRouter = require(`../app/${module}/router`);
    moduleRouter(app, router);
});

handler.run(app);

module.exports = app;