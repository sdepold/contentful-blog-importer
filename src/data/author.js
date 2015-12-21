'use strict';

import { importEntities } from './base';
import { schema } from '../schema/author';

export function importData (entries, space, authorType, data) {
  validate(data);

  return importEntities(...arguments, 'author', mapData);
}

function validate (data) {
  let authors = data.authors || [];
  let schemaProperties = schema().fields.map((field) => field.id);

  authors.forEach((author) => {
    let invalidProps = Object.keys(author).filter((property) =>
      schemaProperties.indexOf(property) > -1
    );

    if (invalidProps.lenth > 0) {
      console.log('Invalid author:', author);
      console.log('Invalid author properties:', invalidProps);

      throw new Error('Invalid author properties found: ' + invalidProps.join('.'));
    }
  });
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
