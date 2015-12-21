'use strict';

export function ensureEntity (space, contentTypes, schema) {
  let entityName = schema.name;
  let entityFields = schema.fields;
  let contentType = contentTypes.find((contentType) => contentType.name === entityName);

  if (contentType) {
    console.log(`- The content type "${entityName}" already exists`);
    return contentType;
  }

  return space.createContentType({
    sys: { id: entityName.toLowerCase() },
    name: entityName,
    fields: entityFields,
    displayField: entityFields[0].id
  }).then((contentType) => {
    console.log(`- Created the content type "${entityName}"`);
    return space.publishContentType(contentType);
  }).then((contentType) => {
    console.log(`- Published the content type "${entityName}"`);
    return contentType;
  });
}
