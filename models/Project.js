import Waterline from 'waterline';

export default Waterline.Collection.extend({

  /**
   * A unique name for this model
   *
   * @type {String}
   */
  identity: 'project',

  /**
   * The table name for this model
   *
   * @type {String}
   */
  tableName: 'projects',

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
     * The name of the project
     *
     * @type {Object}
     */
    name: {
      type: 'string',
      required: true
    },

    /**
     * The project description
     *
     * @type {Object}
     */
    description: {
      type: 'text',
      required: true
    },

    /**
     * The avatar url for the project
     *
     * @type {Object}
     */
    avatar_url: {
      type: 'string'
    },

    /**
     * One-to-many association between a Project and Users
     *
     * @type {Object}
     */
    members: {
      collection: 'user',
      via: 'projects'
    }
  }

});
