'use strict';

import * as winston from 'winston';

let transports = [];

if (process.env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.Console());
}

module.exports = new winston.Logger({ transports });
