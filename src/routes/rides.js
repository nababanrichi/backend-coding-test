const app = module.exports = require('express')();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {insertRide, rideList, rideById} = require('./../actions').rides;

module.exports = (db) => {
  /**
     * @api {post} /rides Insert New Rides to DB
     * @apiName putRides
     * @apiGroup Rides
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} start_lat Start Latitude, need to be between -90 and 90.
     * @apiParam {Number} start_long Start Longitude, need to be between -100 and 100.
     * @apiParam {Number} end_lat End Latitude, need to be between -90 and 90.
     * @apiParam {Number} end_long End Longitude, need to be between -100 and 100.
     * @apiParam {String} rider_name Rider Name, need to be more than 1 char.
     * @apiParam {String} driver_name Driver Name, need to be more than 1 char.
     * @apiParam {String} driver_vehicle Driver Vehicle, need to be more than 1 char.
     *
     * @apiParamExample {json} Request-Example:
     *  {
     *      "start_lat": "0",
     *      "start_long": "0",
     *      "end_lat": "0",
     *      "end_long": "0",
     *      "rider_name": "Budi",
     *      "driver_name": "Anton",
     *      "driver_vehicle": "Tesla Model 3 2020"
     * }
     *
     * @apiSuccess {Object[]} rides Rides Record.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *      [
     *          {
     *              "rideID": 1,
     *              "startLat": 0,
     *              "startLong": 0,
     *              "endLat": 0,
     *              "endLong": 0,
     *              "riderName": "Budi",
     *              "driverName": "Anton",
     *              "driverVehicle": "Tesla Model 3 2020",
     *              "created": "2019-11-14 03:17:51"
     *          }
     *      ]
     *
     * @apiError {String} error_code Error Code (e.g.: VALIDATION_ERROR).
     * @apiError {String} message Error Message.
     *
     * @apiErrorExample Latitude/Longitude Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "VALIDATION_ERROR",
     *       "message": "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
     *     }
     * @apiErrorExample Name/Vehicle Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "VALIDATION_ERROR",
     *       "message": "Rider name must be a non empty string"
     *     }
     */
  app.post('/', jsonParser, (req, res) => {
    // TODO: Dirty Code #2 - Need to find out how to set log globally
    const requestStart = Date.now();

    const body = req.body;

    res.on('finish', () => {
      const {rawHeaders, httpVersion, method, socket, url} = req;
      const {remoteAddress, remoteFamily} = socket;
      const {statusCode, statusMessage} = res;
      const headers = res.getHeaders();

      if (statusCode !== 200) {
        console.log(
            JSON.stringify({
              timestamp: Date.now(),
              processingTime: Date.now() - requestStart,
              rawHeaders,
              body,
              httpVersion,
              method,
              remoteAddress,
              remoteFamily,
              url,
              response: {
                statusCode,
                statusMessage,
                headers,
              },
            }),
        );
      }
    });
    // END: Dirty Code #2

    insertRide(body, db, function(result) {
      if (result.error_code == undefined) {
        res.send(result);
      } else if (result.error_code == 'SERVER_ERROR') {
        res.status(500).send(result);
      } else if (result.error_code == 'VALIDATION_ERROR') {
        res.status(400).send(result);
      } else {
        res.status(404).send(result);
      }
    });
  });

  /**
     * @api {get} /rides Get all Rides at DB
     * @apiName getRides
     * @apiGroup Rides
     * @apiVersion 0.2.0
     *
     * @apiParam {Number} page Optional, page number.
     * @apiParam {Number} limit Optional, total records will be given max per request.
     *
     * @apiParamExample {json} Request-Example:
     *  {
     *      "page": "1",
     *      "limit": "1"
     * }
     *
     * @apiSuccess {Object[]} rides List of rides.
     *
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    {
     *      "records": [
     *        {
     *           "rideID": 1,
     *           "startLat": 0,
     *           "startLong": 0,
     *           "endLat": 0,
     *           "endLong": 0,
     *           "riderName": "Budi",
     *           "driverName": "Anton",
     *           "driverVehicle": "Tesla Model 3 2020",
     *           "created": "2019-11-14 03:17:51"
     *        }
     *      ],
     *      "page": 1,
     *      "limit": 1,
     *      "total_page": 1,
     *      "total_record": 1
     *    }
     *
     * @apiError {String} error_code Error Code (e.g.: VALIDATION_ERROR).
     * @apiError {String} message Error Message.
     *
     * @apiErrorExample Server Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "SERVER_ERROR",
     *       "message": "Unknown error"
     *     }
     * @apiErrorExample Rides Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "RIDES_NOT_FOUND_ERROR",
     *       "message": "Could not find any rides"
     *     }
     */
  app.get('/', jsonParser, (req, res) => {
    // TODO: Dirty Code #2 - Need to find out how to set log globally
    const requestStart = Date.now();

    const body = req.body;

    res.on('finish', () => {
      const {rawHeaders, httpVersion, method, socket, url} = req;
      const {remoteAddress, remoteFamily} = socket;
      const {statusCode, statusMessage} = res;
      const headers = res.getHeaders();

      if (statusCode !== 200) {
        console.log(
            JSON.stringify({
              timestamp: Date.now(),
              processingTime: Date.now() - requestStart,
              rawHeaders,
              body,
              httpVersion,
              method,
              remoteAddress,
              remoteFamily,
              url,
              response: {
                statusCode,
                statusMessage,
                headers,
              },
            }),
        );
      }
    });
    // END: Dirty Code #2

    rideList(req, db, function(result) {
      if (result.error_code == undefined) {
        res.send(result);
      } else if (result.error_code == 'SERVER_ERROR') {
        res.status(500).send(result);
      } else {
        res.status(404).send(result);
      }
    });
  });

  /**
     * @api {get} /rides/:id Get Rides by ID
     * @apiName getRidesById
     * @apiGroup Rides
     * @apiVersion 0.2.0
     *
     * @apiSuccess {Object[]} rides Rides Record.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "rideID": 1,
     *         "startLat": 0,
     *         "startLong": 0,
     *         "endLat": 0,
     *         "endLong": 0,
     *         "riderName": "Budi",
     *         "driverName": "Anton",
     *         "driverVehicle": "Tesla Model 3 2020",
     *         "created": "2019-11-14 03:17:51"
     *     }
     *
     * @apiError {String} error_code Error Code (e.g.: VALIDATION_ERROR).
     * @apiError {String} message Error Message.
     *
     * @apiErrorExample Server Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "SERVER_ERROR",
     *       "message": "Unknown error"
     *     }
     * @apiErrorExample Record not Found Error:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error_code": "RIDES_NOT_FOUND_ERROR",
     *       "message": "Could not find any rides"
     *     }
     */
  app.get('/:id', (req, res) => {
    // TODO: Dirty Code #2 - Need to find out how to set log globally
    const requestStart = Date.now();

    const body = req.body;

    res.on('finish', () => {
      const {rawHeaders, httpVersion, method, socket, url} = req;
      const {remoteAddress, remoteFamily} = socket;
      const {statusCode, statusMessage} = res;
      const headers = res.getHeaders();

      if (statusCode !== 200) {
        console.log(
            JSON.stringify({
              timestamp: Date.now(),
              processingTime: Date.now() - requestStart,
              rawHeaders,
              body,
              httpVersion,
              method,
              remoteAddress,
              remoteFamily,
              url,
              response: {
                statusCode,
                statusMessage,
                headers,
              },
            }),
        );
      }
    });
    // END: Dirty Code #2

    rideById(req, db, function(result) {
      if (result.error_code == undefined) {
        res.send(result);
      } else if (result.error_code == 'SERVER_ERROR') {
        res.status(500).send(result);
      } else {
        res.status(404).send(result);
      }
    });
  });

  return app;
};
