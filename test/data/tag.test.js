'use strict';

import * as _ from 'lodash';
import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import * as Tag from '../../src/data/tag';
import * as sinon from 'sinon';

describe('tag', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();

  describe('importData', () => {
    let space, data;

    beforeEach(() => {
      data = {
        authors: [],
        posts: [],
        tags: [
          { name: 'General', slug: 'general' },
          { name: 'Coding', slug: 'coding' }
        ]
      };

      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it('creates and publishes the tags', () => {
      let created = { general: false, coding: false };
      let published = { general: false, coding: false };

      ['coding', 'general'].forEach((id) => {
        env.app.put(`/spaces/space-id/entries/${id}`, (req, res) => {
          created[id] = true;
          res.send({ sys: { id: id, version: 1 }, fields: { name: id, slug: id } });
        });

        env.app.put(`/spaces/space-id/entries/${id}/published`, (req, res) => {
          published[id] = true;
          res.send({ sys: { id: id, version: 2 }, fields: { name: id, slug: id } });
        });
      });

      let tagContentType = _.extend({ sys: { id: 'tag' } }, contentTypes.Tag);

      return Tag.importData([], space, tagContentType, data).then(() => {
        expect(created).to.eql({ general: true, coding: true });
        expect(published).to.eql({ general: true, coding: true });
      });
    });
  });
});
