'use strict';

import { importEntities, validateEntities } from './base';
import { schema } from '../schema/author';

export function importData (entries, space, authorType, data) {
  validateEntities(data.authors || [], 'author', schema());
  return importEntities(...arguments, 'author', mapData);
}

function mapData (user) {
  return {
    sys: { id: user.slug },
    fields: {
      name: { 'en-US': user.name },
      slug: { 'en-US': user.slug },
      email: { 'en-US': user.email },
      image: { 'en-US': user.image }
    }
  };
}
