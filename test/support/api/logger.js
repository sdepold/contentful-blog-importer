'use strict';

export default function logger (req, res, next) {
  if (process.env.DEBUG) {
    console.log(req.method, req.path);
  }

  next();
}
