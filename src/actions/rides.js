/**
 * @param {Object} req request data.
 * @param {Object} db database connection.
 * @param {Object} callback callback data.
 * @return {Object} response response data.
 */
function insertRide(req, db, callback) {
  const startLatitude = Number(req.start_lat);
  const startLongitude = Number(req.start_long);
  const endLatitude = Number(req.end_lat);
  const endLongitude = Number(req.end_long);
  const riderName = req.rider_name;
  const driverName = req.driver_name;
  const driverVehicle = req.driver_vehicle;

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return callback({
      error_code: 'VALIDATION_ERROR',
      message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    });
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return callback({
      error_code: 'VALIDATION_ERROR',
      message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    });
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return callback({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return callback({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return callback({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  const values = [startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle];

  db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function(err) {
    if (err) {
      return callback({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }

    db.all('SELECT * FROM Rides WHERE rideID = ?', db.lastID, function(err, rows) {
      if (err) {
        return callback({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      return callback(rows);
    });
  });
}

/**
 * @param {Object} req request data.
 * @param {Object} db database connection.
 * @param {Object} callback callback data.
 */
function rideList(req, db, callback) {
  let limit = 100;
  if (req.body.limit != undefined) {
    limit = Number(req.body.limit);
  }
  let page = 1;
  if (req.body.page != undefined) {
    page = Number(req.body.page);
  }
  let totalPage = 1;
  let totalRecord = 0;
  const offset = (page-1) * limit;

  db.get('SELECT count(rideID) total_record FROM Rides', function(err, result) {
    if (err) {
      return callback({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }

    totalRecord = result.total_record;
    if (totalRecord > 0) {
      totalPage = Math.ceil(totalRecord/limit);

      if (page > totalPage) {
        return callback({
          records: [],
          page: page,
          limit: limit,
          total_page: totalPage,
          total_record: totalRecord,
        });
      } else {
        db.all(`SELECT * FROM Rides LIMIT '${limit}' OFFSET '${offset}'`, function(err, rows) {
          if (err) {
            return callback({
              error_code: 'SERVER_ERROR',
              message: 'Unknown error',
            });
          }

          return callback({
            records: rows,
            page: page,
            limit: limit,
            total_page: totalPage,
            total_record: totalRecord,
          });
        });
      }
    } else {
      return callback({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }
  });
}

/**
 * @param {Object} req request data.
 * @param {Object} db database connection.
 * @param {Object} callback callback data.
 */
function rideById(req, db, callback) {
  const rideId = Number(req.params.id);

  db.get(`SELECT * FROM Rides WHERE rideID='${rideId}'`, function(err, record) {
    if (err) {
      return callback({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }

    if (record == null) {
      return callback({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }

    return callback(record);
  });
}

module.exports = {
  insertRide,
  rideList,
  rideById,
};
