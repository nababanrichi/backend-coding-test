const app = module.exports = require('express')();

module.exports = (db, logger) => {
  app.use('/health', require('./health'));

  // the catch all route
  app.all('*', (req, res) => {
    res.status(404).send({msg: 'not found'});
  });

  return app;
};
