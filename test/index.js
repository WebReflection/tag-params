const {params, partial} = require('../cjs');

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

expect(params(''), 1, '', 'no interpolations is OK');
expect(params('${}'), 2, '', 'empty around interpolations is OK');
expect(params('${123}'), 2, '123', 'single interpolation is OK');
expect(params('a${"b"}c'), 2, 'abc', 'single interpolation in between is OK');
expect(params('${"a"}b${"c"}'), 3, 'abc', 'multi interpolations are OK');
expect(params('${"a"}${"b"}${"c"}'), 4, 'abc', 'only interpolations are OK');
expect(params('Hello ${user}', {user: 'test'}), 2, 'Hello test', 'namespace is OK');
expect(params('Hello ${function (){}}'), 2, 'Hello function (){}', 'inner curly is OK');
expect(params('${[1,2,3]}'), 2, '1,2,3', 'array is OK');
expect(partial('a${123}b', () => 456)(), 2, 'a456b', 'partial is OK');

const update = partial('Hello ${user}!');
console.assert(
  update({user: 'First'})[0] ===
  update({user: 'Second'})[0],
  'partial returns always the same template'
);
