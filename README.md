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

The most requested use case for this is likely landing templates on the page and use their content, [as shown in this CodePen example](https://codepen.io/WebReflection/pen/OJMRZow?editors=0010):

```html
<template id="list">
  <ul>${items.map(function (item) {
    return html`<li>${item.text}</li>`;
  })}</ul>
</template>
<div id="app"></div>

<script type="module">
import tagParams from '//unpkg.com/tag-params?module';
import {render, html} from '//unpkg.com/uhtml?module';

render(
  document.getElementById('app'),
  html(...tagParams(
    document.getElementById('list').innerHTML,
    {
      html,
      items: [{text: 'first'}, {text: 'second'}]
    }
  ))
);
</script>
```

Please note this module inevitably needs/uses `Function` to evaluate the code within a `with` statement.
