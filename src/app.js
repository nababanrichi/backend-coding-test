'use strict';

const express = require('express');
const app = express();

module.exports = (db) => {
  const routes = require('./routes')(db);

  app.use(routes);

  return app;
};
