'use strict';

import { importEntities, validateEntities } from './base';
import { schema } from '../schema/tag';

export function importData (entries, space, contentType, data) {
  validateEntities(data.tags || [], 'tag', schema());
  return importEntities(...arguments, 'tag', mapData);
}

function mapData (tag) {
  return {
    sys: { id: tag.slug },
    fields: {
      name: { 'en-US': tag.name },
      slug: { 'en-US': tag.slug }
    }
  };
}
