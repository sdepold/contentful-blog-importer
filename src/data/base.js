'use strict';

import logger from '../logger';

export function importEntities (entries, space, entityContentType, data, entityName, dataMapper) {
  let entities = data[`${entityName}s`];

  return Promise.all(
    entities.map((entityData) => {
      let entity = entries.find((entry) => entry.sys.id === entityData.slug);

      if (entity) {
        logger.info(`- The ${entityName} "${entityData.slug}" already exists`);
        return entity;
      }

      return mapData(entityData, dataMapper)
        .then((mappedData) => {
          return space.createEntry(entityContentType, mappedData);
        })
        .then((entity) => {
          logger.info(`- Created ${entityName} "${entityData.slug}"`);

          if (!entityData.status || (entityData.status === 'published')) {
            return space.publishEntry(entity).then((entity) => {
              logger.info(`- Published ${entityName} "${entityData.slug}"`);
              return entity;
            });
          }
        });
    })
  );
}

function mapData (data, mapper) {
  let mappedData = mapper(data);

  return (mappedData instanceof Promise) ? mappedData : Promise.resolve(mappedData);
}

export function validateEntities (entities, entityName, schema) {
  let schemaProperties = schema.fields.map((field) => field.id);

  entities.forEach((entity) => {
    let invalidProps = Object.keys(entity).filter((property) =>
      schemaProperties.indexOf(property) === -1
    );

    if (invalidProps.length > 0) {
      logger.warn(`Invalid ${entityName}: `, entity);
      logger.warn(`Invalid ${entityName} properties: `, invalidProps);

      throw new Error(`Invalid ${entityName} properties found: ` + invalidProps.join(', '));
    }
  });
}
