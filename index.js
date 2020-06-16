self.tagParams = (function (exports) {
  'use strict';

  var parse = function parse(content) {
    var template = [];
    var values = [];
    var length = content.length;
    var i = 0;

    while (i <= length) {
      var open = content.indexOf('${', i);

      if (-1 < open) {
        template.push(content.slice(i, open));
        open = i = open + 2;
        var close = 1;

        while (i < length) {
          var c = content[i++];
          close += c === '{' ? 1 : c === '}' ? -1 : 0;
          if (close < 1) break;
        }

        values.push(content.slice(open, i - 1));
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

  var index = (function (content, object) {
    var _parse = parse(content),
        template = _parse.template,
        values = _parse.values;

    var interpolations = 'return[' + values + ']';
    var prefix = object ? 'with(arguments[0])' : '';
    return [template].concat(Function(prefix + interpolations)(object));
  });

  exports.default = index;

  return exports;

}({}).default);
