const app = module.exports = require('express')();

module.exports = (db) => {
  app.use('/health', require('./health'));
  app.use('/rides', require('./rides')(db));

  // the catch all route
  app.all('*', (req, res) => {
    res.status(404).send({msg: 'not found'});
  });

  return app;
};
