# tag-params

[![Build Status](https://travis-ci.com/WebReflection/tag-params.svg?branch=master)](https://travis-ci.com/WebReflection/tag-params) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/tag-params/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/tag-params?branch=master)

Transform a generic string into parameters suitable for template literals functions tags.

```js
import {params} from 'tag-params';
// const {params} = require('tag-params');
// <script src="//unpkg.com/tag-params"></script>

console.log(
  params('Random: ${Math.random()}!')
);
// [["Random: ", "!"], 0.3456787643]

console.log(
  params('Hello ${user}', {user: 'test'})
);
// [["Hello ", ""], "test"]

// invoke tags through the returned parameters
genericTag(...params(content, namespace));
```


## API

There are 3 utilities exported by this module, so that accordingly with your import, you should get:

  * `params`, the main utility, which parses and resolves _values_ in one go.
  * `parse`, which returns a `{template, values}` object, with mapped "_chunks_" in the template, and the list of _values_ (interpolations/holes), where each value is a string.
  * `partial`, which uses `parse` and returns a callback that will map new values through the optional `object` passed along.


### params(content:string, object?:any) => [string[], ...any[]]

It's the "_default_" use case of this utility. It parses the `content` and returns a `[template, ...values]` _Array_ with values retrieved through the optional `object`. If no `object` is passed along, it simply evaluates interpolations as plain JavaScript.

This utility is a shortcut for a one-off `partial(content)(object)` call.


### parse(content:string, transform?:function) => {template:string[], values:string[]}

It parses a string, and it uses the optional `transform` callback, which is _no-op_ as default, to assign each _value_ to the list of expected _values_.

The `transform` optional callback is specially useful when the interpolated content might contains _HTML_ normalized chars, such as `value =&gt; stuff(value)` instead of `value => stuff(value)`, which is normal when the content is retrieved via `element.innerHTML`, as example.

The `template` property contains all chunks around `${...}` interpolations, while `values` contains all interpolations content as string.


### partial(content:string, transform?:function) => (object?) => [string[], ...any[]]

This utility parses the `content` through an optional `transform`, and returns a _callback_ that accepts a new object each time.

This is particularly useful to avoid parsing the same template content over and over, and just update its interpolation _values_ through the optional `object`.

```js
import {partial} from 'tag-params';
const update = partial('Hello ${user}!');

console.log(update({user: 'First'}));
// [["Hello ", "!"], "First"]

console.log(update({user: 'Second'}));
// [["Hello ", "!"], "Second"]

// always true
console.assert(
  update({user: 'First'})[0] ===
  update({user: 'Second'})[0]
);
```

The main advantage of this utility is that it parses the `content` and it creates the `template` _Array_ only **once**, meaning every template literal based library could benefit from it, using the uniqueness of the `template` to parse complex chunks of _HTML_, or anything else, once, enabling repeated updates at almost zero performance cost (well, values are still evaluated).



## Use Cases

The most common/requested use case for this is likely landing templates on the page and use their content, [as shown in this CodePen example](https://codepen.io/WebReflection/pen/OJMRZow?editors=0010):

```html
<template id="list">
  <ul>${items.map(function (item) {
    return html`<li>${item.text}</li>`;
  })}</ul>
</template>
<div id="app"></div>

<script type="module">
import {params} from '//unpkg.com/tag-params?module';
import {render, html} from '//unpkg.com/uhtml?module';

render(
  document.getElementById('app'),
  html(...params(
    document.getElementById('list').innerHTML,
    {
      html,
      items: [{text: 'first'}, {text: 'second'}]
    }
  ))
);
</script>
```

This works well with libraries such as [uhtml](https://github.com/WebReflection/uhtml#readme), [lighterhtml](https://github.com/WebReflection/lighterhtml#readme), or [hyperHTML](https://github.com/WebReflection/hyperHTML#readme), as well as any library based on template literals tags.

However, this module can work with literally any possible template literal tag function, as these all share the same signature, hence will accept transformed chunks, as _template_, and the rest of the interpolations as _values_.


## Caveats

Please note this module inevitably needs/uses `Function` to evaluate the code within a `with` statement, as there's no other way to evaluated interpolations through passed data.

Moreover, the current interpolations parser is extremely rudimental, it simply skips extra `{` and `}` chars within the value, but it doesn't parse all possible JS syntax.

This means that if an interpolation contains a string such as `${"breaking { char"}` or `${"breaking } char"}` the result will break.

The good practice here is to pass strings via the `object`, instead of hard coding these within interpolations, as this won't likely get fixed any time soon (if ever).



## Compatibility

Every JavaScript engine, either client, server, or IoT, that supports `string[index]` access, as I couldn't bother myself adding a slow and jurassic `string.charAt(index)` in the code.
