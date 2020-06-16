# tag-params

[![Build Status](https://travis-ci.com/WebReflection/tag-params.svg?branch=master)](https://travis-ci.com/WebReflection/tag-params) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/tag-params/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/tag-params?branch=master)

Transform a generic string into parameters suitable for template literals functions tags.

```js
import tagParams from 'tag-params';
// const tagParams = require('tag-params');

console.log(
  tagParams('Random: ${Math.random()}!')
);
// [["Random: ", "!"], 0.3456787643]

console.log(
  tagParams('Hello ${user}', {user: 'test'})
);
// [["Hello ", ""], "test"]

// invoke tags through the returned parameters
genericTag(...tagParams(content, namespace));
```
