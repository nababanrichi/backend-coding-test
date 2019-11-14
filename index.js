'use strict';

const port = 8010;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

// TODO: Dirty Code #1 - Need to find out how to set this cleaner
const { createLogger, format, transports } = require('winston');
var util = require('util');
const fs = require('fs');
const path = require('path');

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'error.log');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
            )
        )
        }),
        new transports.File({ filename })
    ]
    });
    
module.exports = {
    middleware: function(req, res, next){
        console.info(req.method, req.url, res.statusCode);
        next();
    }
};
    
function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}
    
console.log = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function(){
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function(){
    logger.debug.apply(logger, formatArgs(arguments));
};
// END: Dirty Code #1

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db, logger);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});