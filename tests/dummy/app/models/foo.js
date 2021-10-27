import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class FooModel extends Model {
  @belongsTo('baz') baz;
  @hasMany('bar') bars;
}
