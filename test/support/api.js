'use strict';

let express = require('express');

export default function stubApi (options = {}) {
  let app = express();

  function logRequest (req, res, next) {
    if (process.env.DEBUG) {
      console.log(req.method, req.path);
    }

    next();
  }

  app.get('*', logRequest);
  app.put('*', logRequest);
  app.post('*', logRequest);

  app.get('/spaces/space-id', (req, res) => {
    res.send(options.space || {
      sys: { id: 'space-id' },
      name: 'some-space'
    });
  });

  app.get('/spaces/space-id/content_types', (req, res) => {
    let contentTypes = options.contentTypes || [];

    res.send({
      sys: { type: 'Array' },
      total: contentTypes.length,
      skip: 0,
      limit: 100,
      items: contentTypes
    });
  });

  app.get('/spaces/space-id/entries', (req, res) => {
    let entries = options.entries || [];

    res.send({
      sys: { type: 'Array' },
      total: entries.length,
      skip: 0,
      limit: 100,
      items: entries
    });
  });

  let server = app.listen(3000);

  app.close = server.close.bind(server);

  return app;
}
