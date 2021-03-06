/**
 * @typedef {object} ParseResult an object with parsed results
 * @property {string[]} template - the list of chunks around interpolations
 * @property {string[]} values - interpolations as strings
 */

/**
 * @typedef {[string[], ...any[]]} TagArguments an array to use as template
 *                                              literals tag arguments
 */

/**
 * @callback Partial a callback that re-evaluate each time new data associated
 *                   to the same template-like array.
 * @param {object} [object] the optional data to evaluate as interpolated values
 * @returns {TagArguments} an array to use as template literals tag arguments
 */

/**
* The default `transform` callback
* @param {string} value the interpolation value as string
*/
const noop = value => value;

/**
 * The default "null" fallback when no object is passed to the Partial.
 */
const fallback = Object.create(null);

/**
 * Given a string and an optional object carrying references used through
 * such string interpolation, returns an array that can be used within any
 * template literal function tag.
 * @param {string} content the string to parse/convert as template chunks
 * @param {object} [object] the optional data to evaluate as interpolated values
 * @returns {TagArguments} an array to use as template literals tag arguments
 */
export const params = (content, object) => partial(content)(object);

/**
 * Given a string and an optional function used to transform each value
 * found as interpolated content, returns an object with a `template` and
 * a `values` properties, as arrays, containing the template chunks,
 * and all its interpolations as strings.
 * @param {string} content the string to parse/convert as template chunks
 * @param {function} [transform] the optional function to modify string values
 * @returns {ParseResult} an object with `template` and `values` arrays.
 */
export const parse = (content, transform) => {
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

/**
 * Given a string and an optional function used to transform each value
 * found as interpolated content, returns a callback that can be used to
 * repeatedly generate new content from the same template array.
 * @param {string} content the string to parse/convert as template chunks
 * @param {function} [transform] the optional function to modify string values
 * @returns {Partial} a function that accepts an optional object to generate
 *                    new content, through the same template, each time.
 */
export const partial = (content, transform) => {
  const {template, values} = parse(content, transform);
  const args = [template];
  const rest = Function(
    'return function(){with(arguments[0])return[' + values + ']}'
  )();
  return object => args.concat(rest(object || fallback));
};
