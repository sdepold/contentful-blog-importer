# contentful-blog-importer
Generic data importer for blogs on Contentful.

## Usage

```js
import ContentfulBlogImporter from 'contentful-blog-importer';

new ContentfulBlogImporter(spaceId, cmaToken, options).run(data);
```

### Options

```js
| Name | Description                                 | Default            | Example                                |
|------|---------------------------------------------|--------------------|----------------------------------------|
| host | The host you want to run the import against | api.contentful.com | { host: 'my-test-stub.localhost.com' } |
```

### Data format

```js
let data = {
  authors: [
    {
      name: 'John Doe',
      slug: 'john-doe', // Falls back to an auto-generated slug based on the name.
      email: 'john@doe.com',
      image: 'TBD.jpg'
    }
  ],

  tags: [
    {
      name: 'General',
      slug: 'general'  // Falls back to an auto-generated slug based on the name.
    }
  ],

  posts: [
    {
      title: 'A generic data importer for blogs',
      slug: 'a-generic-data-importer-for-blogs',
      body: '**Various** information about the *importer*',
      publishedAt: '2014-08-19T22:00:00+02:00',
      metaTitle: 'Title for contentful-blog-importer post',
      metaDescription: 'Description for contentful-blog-importer post',
      author: 'slug-of-a-user',
      tags: [ 'slug-of-a-tag', 'slug-of-another-tag' ]
    }
  ]
};
```
