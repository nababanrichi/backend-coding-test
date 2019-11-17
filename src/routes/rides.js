const app = module.exports = require('express')();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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

    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.all('SELECT * FROM Rides WHERE rideID = ?', db.lastID, function(err, rows) {
        if (err) {
          return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        res.send(rows);
      });
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

    let limit = 100;
    if (req.body.limit != undefined) {
      limit = req.body.limit;
    }
    let page = 1;
    if (req.body.page != undefined) {
      page = req.body.page;
    }
    let totalPage = 1;
    let totalRecord = 0;
    const offset = (page-1) * limit;

    db.get('SELECT count(rideID) total_record FROM Rides', function(err, result) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      totalRecord = result.total_record;
      if (totalRecord > 0) {
        totalPage = Math.ceil(totalRecord/limit);

        if (page > totalPage) {
          return res.send({
            records: [],
            page: page,
            limit: limit,
            total_page: totalPage,
            total_record: totalRecord,
          });
        } else {
          db.all('SELECT * FROM Rides LIMIT '+limit+' OFFSET '+offset, function(err, rows) {
            if (err) {
              return res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
              });
            }

            res.send({
              records: rows,
              page: page,
              limit: limit,
              total_page: totalPage,
              total_record: totalRecord,
            });
          });
        }
      } else {
        res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }
    });
  });

  /**
     * @api {get} /rides/:id Get Rides by ID
     * @apiName getRidesById
     * @apiGroup Rides
     * @apiVersion 0.1.0
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

    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function(err, rows) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  return app;
};
