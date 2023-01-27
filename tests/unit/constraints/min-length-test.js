import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import minLength from '@zestia/ember-validation/constraints/min-length';

module('minLength', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(minLength({ min: 4 })('hiya'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      minLength({ min: 3 })('hi'),
      'Length must be at least 3'
    );
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      minLength({ min: 6, message: 'too short' })('hello'),
      'too short',
      'returns custom message if invalid'
    );
  });

  test('supports ember data', function (assert) {
    assert.expect(2);

    const foo = this.store.createRecord('foo', {
      bars: [this.store.createRecord('bar')]
    });

    const validate = minLength({ min: 2 });

    assert.strictEqual(validate(foo.bars), 'Length must be at least 2');

    foo.bars.push(this.store.createRecord('bar'));

    assert.strictEqual(validate(foo.bars), undefined);
  });

  test('inputs', function (assert) {
    assert.expect(14);

    assert.strictEqual(minLength({ min: 1 })(''), 'Length must be at least 1');
    assert.strictEqual(minLength({ min: 1 })(), 'Length must be at least 1');
    assert.strictEqual(
      minLength({ min: 2 })(['a']),
      'Length must be at least 2'
    );
    assert.strictEqual(
      minLength({ min: 4 })('abc'),
      'Length must be at least 4'
    );
    assert.strictEqual(minLength({ min: 0 })(''), undefined);
    assert.strictEqual(minLength({ min: 0 })('a'), undefined);
    assert.strictEqual(minLength({ min: 0 })(), undefined);
    assert.strictEqual(minLength({ min: 0 })(null), undefined);
    assert.strictEqual(minLength({ min: 1 })('a'), undefined);
    assert.strictEqual(minLength({ min: 1 })('ab'), undefined);
    assert.strictEqual(minLength({ min: 1 })('abcd'), undefined);
    assert.strictEqual(minLength({ min: 2 })(['a', 'b']), undefined);
    assert.strictEqual(minLength({ min: 2 })(10), undefined);
    assert.strictEqual(minLength({ min: 2 })(100), undefined);
  });
});
