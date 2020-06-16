'use strict';
const parse = content => {
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
      while (i < length) {
        const c = content[i++];
        close += c === '{' ? 1 : (c === '}' ? -1 : 0);
        if (close < 1)
          break;
      }
      values.push(content.slice(open, i - 1));
    }
    else {
      template.push(content.slice(i));
      i = length + 1;
    }
  }
  return {template, values};
};

module.exports = (content, object) => {
  const {template, values} = parse(content);
  const interpolations = 'return[' + values + ']';
  const prefix = object ? 'with(arguments[0])' : '';
  return [template].concat(Function(prefix + interpolations)(object));
};
