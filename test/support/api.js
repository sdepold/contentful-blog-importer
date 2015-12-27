'use strict';

let express = require('express');
let bodyParser = require('body-parser');

import logger from './api/logger';
import * as routes from './api/default-routes';

export default function stubApi (options = {}) {
  let app = express();

  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(logger);

  routes.getSpace(app, options);
  routes.getContentTypes(app, options);
  routes.getEntries(app, options);

  let server = app.listen(3000);

  app.close = server.close.bind(server);

  return app;
}
