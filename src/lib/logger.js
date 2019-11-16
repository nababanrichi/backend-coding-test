'use strict';

const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

module.exports = () => {
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

  return logger;
};
