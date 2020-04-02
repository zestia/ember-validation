import { module, test } from 'qunit';
import truthyConstraint from '@zestia/ember-validation/constraints/truthy';

module('truthy', function () {
  test('#truthyConstraint', function (assert) {
    assert.expect(3);

    let func;

    func = truthyConstraint();

    assert.equal(func(true), null, 'returns nothing when valid');

    assert.equal(
      func(false),
      'must be truthy',
      'returns default message if invalid'
    );

    func = truthyConstraint({ message: 'please accept the terms' });

    assert.equal(
      func(),
      'please accept the terms',
      'returns custom message if invalid'
    );
  });
});
