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
     * A short tagline for the project
     *
     * @type {Object}
     */
    tagline: {
      type: 'string'
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
      type: 'string',
      required: true
    },

    /**
     * The site url for the project
     *
     * @type {Object}
     */
    site_url: {
      type: 'string',
      required: true
    },

    /**
     * The github url for the project
     *
     * @type {Object}
     */
    github_url: {
      type: 'string',
      unique: true
    },

    /**
     * One-to-many association between a Project and Users
     *
     * @type {Object}
     */
    members: {
      collection: 'user',
      via: 'projects'
    },

    /**
     * Many-to-many association between Tags and Projects
     *
     * @type {Object}
     */
    tags: {
      collection: 'tag',
      via: 'projects',
      dominant: true
    }
  }

});
