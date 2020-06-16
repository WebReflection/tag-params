self.tagParams = (function (exports) {
  'use strict';

  var noop = function noop(s) {
    return s;
  };

  var params = function params(content, object) {
    return partial(content)(object);
  };
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
