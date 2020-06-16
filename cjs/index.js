'use strict';
const noop = s => s;

/**
 * Given a string and an optional object carrying references used through
 * such string interpolation, returns an array that can be used within any
 * template literal function tag.
 * @param {string} content the string to parse/convert as template chunks
 * @param {any} [object] the optional data to evaluate as interpolated values
 * @returns {Array} a [[chunks], ...values] array to use as template tag args
 */
const params = (content, object) => partial(content)(object);
exports.params = params;

/**
 * Given a string and an optional function used to transform each value
 * found as interpolated content, returns an object with a `template` and
 * a `values` properties, as arrays, containing the template chunks,
 * and all its interpolations as strings.
 * @param {string} content the string to parse/convert as template chunks
 * @param {function} [transform] the optional function to modify string values
 * @returns {object} an object with `template` and `values` arrays.
 */
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

/**
 * Given a string and an optional function used to transform each value
 * found as interpolated content, returns a callback that can be used to
 * repeatedly generate new content from the same template array.
 * @param {string} content the string to parse/convert as template chunks
 * @param {function} [transform] the optional function to modify string values
 * @returns {function} a function that accepts an optional object to generate
 *                     new content, through the same template, each time.
 */
const partial = (content, transform) => {
  const {template, values} = parse(content, transform);
  const interpolations = 'return[' + values + ']';
  return object => {
    const prefix = object ? 'with(arguments[0])' : '';
    return [template].concat(Function(prefix + interpolations)(object));
  };
};
exports.partial = partial;
