self.tagParams = (function (exports) {
  'use strict';

  var noop = function noop(s) {
    return s;
  };
  /**
   * Given a string and an optional object carrying references used through
   * such string interpolation, returns an array that can be used within any
   * template literal function tag.
   * @param {string} content the string to parse/convert as template chunks
   * @param {any} [object] the optional data to evaluate as interpolated values
   * @returns {Array} a [[chunks], ...values] array to use as template tag args
   */


  var params = function params(content, object) {
    return partial(content)(object);
  };
  /**
   * Given a string and an optional function used to transform each value
   * found as interpolated content, returns an object with a `template` and
   * a `values` properties, as arrays, containing the template chunks,
   * and all its interpolations as strings.
   * @param {string} content the string to parse/convert as template chunks
   * @param {function} [transform] the optional function to modify string values
   * @returns {object} an object with `template` and `values` arrays.
   */

  var parse = function parse(content, transform) {
    var fn = transform || noop;
    var template = [];
    var values = [];
    var length = content.length;
    var i = 0;

    while (i <= length) {
      var open = content.indexOf('${', i);

      if (-1 < open) {
        template.push(content.slice(i, open));
        open = i = open + 2;
        var close = 1; // TODO: this *might* break if the interpolation has strings
        //       containing random `{}` chars ... but implementing
        //       a whole JS parser here doesn't seem worth it
        //       for such irrelevant edge-case ... or does it?

        while (0 < close && i < length) {
          var c = content[i++];
          close += c === '{' ? 1 : c === '}' ? -1 : 0;
        }

        values.push(fn(content.slice(open, i - 1)));
      } else {
        template.push(content.slice(i));
        i = length + 1;
      }
    }

    return {
      template: template,
      values: values
    };
  };
  /**
   * Given a string and an optional function used to transform each value
   * found as interpolated content, returns a callback that can be used to
   * repeatedly generate new content from the same template array.
   * @param {string} content the string to parse/convert as template chunks
   * @param {function} [transform] the optional function to modify string values
   * @returns {function} a function that accepts an optional object to generate
   *                     new content, through the same template, each time.
   */

  var partial = function partial(content, transform) {
    var _parse = parse(content, transform),
        template = _parse.template,
        values = _parse.values;

    var interpolations = 'return[' + values + ']';
    return function (object) {
      var prefix = object ? 'with(arguments[0])' : '';
      return [template].concat(Function(prefix + interpolations)(object));
    };
  };

  exports.params = params;
  exports.parse = parse;
  exports.partial = partial;

  return exports;

}({}));
