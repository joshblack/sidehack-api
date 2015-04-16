import Waterline from 'waterline';

export default Waterline.Collection.extend({

  /**
   * A unique name for this model
   *
   * @type {String}
   */
  identity: 'user',

  /**
   * The table name for this model
   *
   * @type {String}
   */
  tableName: 'users',

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
     * The User's name
     *
     * @type {Object}
     */
    name: {
      type: 'string',
      required: true
    },

    /**
     * A User's biography on GitHub
     *
     * @type {Object}
     */
    bio: {
      type: 'text'
    },

    /**
     * The User's email
     *
     * @type {Object}
     */
    email: {
      type: 'email',
    },

    /**
     * The provider who the User is authenticated through
     *
     * @type {Object}
     */
    provider: {
      type: 'string',
      required: true
    },

    /**
     * The id assigned to the User by their authentication provider
     *
     * @type {Object}
     */
    provider_id: {
      type: 'integer',
      required: true,
      unique: true
    },

    /**
     * The url for the User's avatar image
     *
     * @type {Object}
     */
    avatar_url: {
      type: 'string',
      required: true
    },

    /**
     * The url for the User's GitHub profile
     *
     * @type {Object}
     */
    github_url: {
      type: 'string',
      required: true,
      unique: true
    },

    /**
     * The url used for making API requests for the User's information
     *
     * @type {Object}
     */
    github_api_url: {
      type: 'string',
      required: true,
      unique: true
    },

    /**
     * The number of public repositories owned by the User
     *
     * @type {Object}
     */
    public_repos_count: {
      type: 'integer'
    },

    /**
     * The number of followers that the User has on GitHub
     *
     * @type {Object}
     */
    follower_count: {
      type: 'integer'
    },

    /**
     * The number of GitHub Users that the User is following
     *
     * @type {Object}
     */
    following_count: {
      type: 'integer'
    },

    /**
     * One-to-one model association between a User and a Token
     *
     * @type {Object}
     */
    token: {
      model: 'token'
    },

    /**
     * One-to-many model association between a Project and Users
     *
     * @type {Object}
     */
    projects: {
      collection: 'project',
      via: 'members',
      dominant: true
    }
  }

});
