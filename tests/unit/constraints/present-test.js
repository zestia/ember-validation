import { module, test } from 'qunit';
import presentConstraint from '@zestia/ember-validation/constraints/present';

module('present', function () {
  test('#presentConstraint', function (assert) {
    assert.expect(3);

    let func;

    func = presentConstraint();

    assert.equal(func('hi'), null, 'returns nothing when valid');

    assert.equal(
      func(''),
      'required value',
      'returns default message if invalid'
    );

    func = presentConstraint({ message: 'nothing there' });

    assert.equal(func(), 'nothing there', 'returns custom message if invalid');
  });
});
