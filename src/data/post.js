'use strict';

import { importEntities, validateEntities } from './base';
import { schema } from '../schema/post';

export function importData (entries, space, postType, data) {
  validateEntities(data.posts || [], 'post', schema());
  return importEntities(...arguments, 'post', mapData);
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
