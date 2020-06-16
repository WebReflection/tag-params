const tagParams = require('../cjs');

const tag = (template, ...values) => {
  const out = [template[0]];
  for (let i = 0, {length} = values; i < length; i++)
    out.push(values[i], template[i + 1]);
  return out.join('');
};

const expect = (params, length, outcome, message) => {
  console.assert(
    params[0].length === length &&
    tag(...params) === outcome,
    message
  );
};

expect(tagParams(''), 1, '', 'no interpolations is OK');
expect(tagParams('${}'), 2, '', 'empty around interpolations is OK');
expect(tagParams('${123}'), 2, '123', 'single interpolation is OK');
expect(tagParams('a${"b"}c'), 2, 'abc', 'single interpolation in between is OK');
expect(tagParams('${"a"}b${"c"}'), 3, 'abc', 'multi interpolations are OK');
expect(tagParams('${"a"}${"b"}${"c"}'), 4, 'abc', 'only interpolations are OK');
expect(tagParams('Hello ${user}', {user: 'test'}), 2, 'Hello test', 'namespace is OK');
expect(tagParams('Hello ${function (){}}'), 2, 'Hello function (){}', 'inner curly is OK');
expect(tagParams('${[1,2,3]}'), 2, '1,2,3', 'array is OK');
