'use strict';

export function getSpace (app, options) {
  app.get('/spaces/space-id', (req, res) => {
    res.send(options.space || {
      sys: { id: 'space-id' },
      name: 'some-space'
    });
  });
}

export function getContentTypes (app, options) {
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
}

export function getEntries (app, options) {
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
}
