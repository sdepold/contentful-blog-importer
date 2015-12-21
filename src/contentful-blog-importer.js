'use strict';

import _ from 'lodash';
import contentful from 'contentful-management';
import importData from './data';
import ensureSchema from './schema';

export default class ContentfulBlogImporter {
  constructor (spaceId, cmaToken, options) {
    if (!spaceId) {
      throw new Error('Missing parameter "spaceId"!');
    }

    if (!cmaToken) {
      throw new Error('Missing parameter "cmaToken"!');
    }

    this.spaceId = spaceId;
    this.cmaToken = cmaToken;
    this.options = _.extend({
      host: 'api.contentful.com',
      secure: true
    }, options);

    this.client = contentful.createClient({
      accessToken: this.cmaToken,
      host: this.options.host,
      secure: this.options.secure
    });
  }

  run (data={ authors: [], posts: [], tags: [] }) {
    return this.client
      .getSpace(this.spaceId)
      .then(this._ensureSchema.bind(this))
      .then((args) => this._importData(...args, data));
  }

  _ensureSchema (space) {
    return ensureSchema(space).then((contentTypes) => {
      return [space, contentTypes];
    });
  }

  _importData (space, contentTypes, data) {
    return importData(space, contentTypes, data);
  }
}
