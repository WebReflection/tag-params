'use strict';
const noop = s => s;

const params = (content, object) => partial(content)(object);
exports.params = params;

const parse = (content, transform) => {
  const fn = transform || noop;
  const template = [];
  const values = [];
  const {length} = content;
  let i = 0;
  while (i <= length) {
    let open = content.indexOf('${', i);
    if (-1 < open) {
      template.push(content.slice(i, open));
      open = (i = open + 2);
      let close = 1;
      // TODO: this *might* break if the interpolation has strings
      //       containing random `{}` chars ... but implementing
      //       a whole JS parser here doesn't seem worth it
      //       for such irrelevant edge-case ... or does it?
      while (0 < close && i < length) {
        const c = content[i++];
        close += c === '{' ? 1 : (c === '}' ? -1 : 0);
      }
      values.push(fn(content.slice(open, i - 1)));
    }
    else {
      template.push(content.slice(i));
      i = length + 1;
    }
  }
  return {template, values};
};
exports.parse = parse;

const partial = (content, transform) => {
  const {template, values} = parse(content, transform);
  const interpolations = 'return[' + values + ']';
  return object => {
    const prefix = object ? 'with(arguments[0])' : '';
    return [template].concat(Function(prefix + interpolations)(object));
  };
};
exports.partial = partial;
