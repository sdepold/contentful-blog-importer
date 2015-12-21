'use strict';

import { importEntities } from './base';
import { schema } from '../schema/tag';

export function importData (entries, space, tagType, data) {
  validate(data);

  return importEntities(...arguments, 'tag', mapData);
}

function validate (data) {
  let tags = data.tags || [];
  let schemaProperties = schema().fields.map((field) => field.id);

  tags.forEach((tag) => {
    let invalidProps = Object.keys(tag).filter((property) =>
      schemaProperties.indexOf(property) > -1
    );

    if (invalidProps.lenth > 0) {
      console.log('Invalid tag:', tag);
      console.log('Invalid tag properties:', invalidProps);

      throw new Error('Invalid tag properties found: ' + invalidProps.join('.'));
    }
  });
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
