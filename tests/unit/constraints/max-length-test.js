import { module, test } from 'qunit';
import { maxLength } from '@zestia/ember-validation/constraints';
import { setupTest } from 'ember-qunit';

module('maxLength', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(maxLength({ max: 2 })('hi'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      maxLength({ max: 3 })('hiya'),
      'Length is too long (max 3)'
    );
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      maxLength({ max: 4, message: 'exceeds max' })('hello'),
      'exceeds max'
    );
  });

  test('supports ember data', function (assert) {
    assert.expect(2);

    const foo = this.store.createRecord('foo', {
      bars: [
        this.store.createRecord('bar'),
        this.store.createRecord('bar'),
        this.store.createRecord('bar')
      ]
    });

    const validate = maxLength({ max: 2 });

    assert.strictEqual(validate(foo.bars), 'Length is too long (max 2)');

    foo.bars.pop();

    assert.strictEqual(validate(foo.bars), undefined);
  });

  test('inputs', function (assert) {
    assert.expect(15);

    assert.strictEqual(
      maxLength({ max: 0 })('a'),
      'Length is too long (max 0)'
    );
    assert.strictEqual(
      maxLength({ max: 1 })('ab', 1),
      'Length is too long (max 1)'
    );
    assert.strictEqual(
      maxLength({ max: 1 })(['a', 'b'], 1),
      'Length is too long (max 1)'
    );
    assert.strictEqual(
      maxLength({ max: 2 })(100),
      'Length is too long (max 2)'
    );
    assert.strictEqual(maxLength({ max: 0 })(''), undefined);
    assert.strictEqual(maxLength({ max: 1 })(''), undefined);
    assert.strictEqual(maxLength({ max: 1 })('a'), undefined);
    assert.strictEqual(maxLength({ max: 4 })('abc'), undefined);
    assert.strictEqual(maxLength({ max: 4 })('abcd'), undefined);
    assert.strictEqual(maxLength({ max: 2 })(['a', 'b']), undefined);
    assert.strictEqual(maxLength({ max: 2 })(10), undefined);
    assert.strictEqual(maxLength({ max: 0 })(null), undefined);
    assert.strictEqual(maxLength({ max: 4 })(null), undefined);
    assert.strictEqual(maxLength({ max: 0 })(), undefined);
    assert.strictEqual(maxLength({ max: 9 })(), undefined);
  });
});
