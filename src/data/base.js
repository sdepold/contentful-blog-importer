'use strict';

export function importEntities (entries, space, entityContentType, data, entityName, dataMapper) {
  let entities = data[`${entityName}s`];

  console.log('-----')
  console.log(data, entities, entityName);

  return Promise.all(
    data[`${entityName}s`].map((entityData) => {
      console.log(entityData)
      let entity = entries.find((entry) => entry.sys.id === entityData.slug);

      if (entity) {
        console.log(`- The ${entityName} "${entityData.slug}" already exists`);
        return entity;
      }

      let mappedData = dataMapper(entityData);
      let promise    = (mappedData instanceof Promise) ? mappedData : Promise.resolve(mappedData);

      return promise
        .then((mappedData) => {
          return space.createEntry(entityContentType, mappedData);
        })
        .then((entity) => {
          console.log(`- Created ${entityName} "${entityData.slug}"`);

          if (!entityData.status || (entityData.status === 'published')) {
            return space.publishEntry(entity).then((entity) => {
              console.log(`- Published ${entityName} "${entityData.slug}"`);
              return entity;
            });
          }
        });
    })
  );
}
