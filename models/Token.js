import Waterline from 'waterline';

export default Waterline.Collection.extend({
  /**
   * A unique name for this model
   *
   * @type {String}
   */
  identity: 'token',

  /**
   * The table name for this model
   *
   * @type {String}
   */
  tableName: 'tokens',

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
     * A valid access token for retrieving Data from GitHub for a User
     *
     * @type {Object}
     */
    value: {
      type: 'string',
    },

    /**
     * One-to-one model association between a Token and a User
     *
     * @type {Object}
     */
    user: {
      model: 'user'
    }
  }

});
