import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class FooModel extends Model {
  @belongsTo('baz', { async: false, inverse: null }) baz;
  @hasMany('bar', { async: false, inverse: null }) bars;
}
