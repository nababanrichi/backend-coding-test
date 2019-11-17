const app = module.exports = require('express')();

/**
 * @api {get} /health Check App Health Status
 * @apiName checkHealth
 * @apiGroup Misc
 * @apiVersion 0.1.0
 *
 * @apiSuccess {String} text Healthy
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "Healthy"
 */
app.get('/', (req, res) => res.send('Healthy'));
