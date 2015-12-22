'use strict';

import * as _ from 'lodash';
import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import * as Tag from '../../src/data/tag';
import * as sinon from 'sinon';
import { humanize } from 'underscore.string';

describe('tag', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();

  describe('importData', () => {
    let space, data;

    beforeEach(() => {
      let tags = [
        { name: 'General', slug: 'general' },
        { name: 'Coding', slug: 'coding' }
      ];

      data = { authors: [], posts: [], tags };

      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it('creates and publishes the tags', () => {
      let created = { general: false, coding: false };
      let published = { general: false, coding: false };
      let tagContentType = _.extend({ sys: { id: 'tag' } }, contentTypes.Tag);

      ['coding', 'general'].forEach((id) => {
        let fields = {
          name: { 'en-US': humanize(id) }, slug: { 'en-US': id }
        };

        env.app.put(`/spaces/space-id/entries/${id}`, (req, res) => {
          // Mark the entry as created
          created[id] = true;

          // Ensure the right payload
          expect(req.body).to.eql({ fields });

          // Send a Contentful-esque response
          res.send({ sys: { id, version: 1 }, fields });
        });

        env.app.put(`/spaces/space-id/entries/${id}/published`, (req, res) => {
          // Mark the entry as published
          published[id] = true;

          // Send a Contentful-esque response
          res.send({ sys: { id, version: 2 }, fields });
        });
      });

      return Tag.importData([], space, tagContentType, data).then(() => {
        // All entries should be created now
        expect(created).to.eql({ general: true, coding: true });

        // All entries should be published now
        expect(published).to.eql({ general: true, coding: true });
      });
    });
  });
});
