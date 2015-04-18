import Waterline from 'waterline';

export default Waterline.Collection.extend({

  /**
   * A unique name for this model
   *
   * @type {String}
   */
  identity: 'tag',

  /**
   * The table name for this model
   *
   * @type {String}
   */
  tableName: 'tags',

  /**
   * A named connection which will be used to read/write to
   *
   * @type {String}
   */
  connection: 'mysql',

  /**
   * Pieces of information about this model
   *
   * @type {Object}
   */
  attributes: {

    /**
     * The value of the tag
     *
     * @type {Object}
     */
    value: {
      type: 'string',
      required: true
    },

    /**
     * Many-to-many association between Tags and Projects
     *
     * @type {Object}
     */
    projects: {
      collection: 'project',
      via: 'tags'
    }
  }
})
