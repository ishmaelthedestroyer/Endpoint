function config(options) {
  settings = angular.extend(settings, options || {});
}

return {
  config: config,
  Request: Request,

  /**
   * gets all persistent headers
   * @returns {Object}
   */
  getPersistentHeaders: function() {
    return persistentHeaders;
  },

  /**
   * adds a persistent header to be sent with every request
   * @param key {String} key of header to add
   * @param value {String} value of header to add
   */
  addPersistentHeader: function(key, value) {
    if (!persistentHeaders) {
      persistentHeaders = {};
    }

    persistentHeaders[key] = value;
  },

  /**
   * removes a persistent header
   * @param key {String} name of header to remove
   */
  removePersistentHeader: function(key) {
    if (!persistentHeaders) {
      persistentHeaders = {};
    }

    delete persistentHeaders[key];
  },

  /**
   * adds a persistent GET parameter to every request
   * @param key {String} key of param to add
   * @param value {String} value of param to add
   */
  addPersistentParam: function(key, value) {
    if (!persistentParams) {
      persistentParams = {};
    }

    persistentParams[key] = value;
  },

  /**
   * removes a persistent param
   * @param key {String} name of param to remove
   */
  removePersistentParam: function(key) {
    if (!persistentParams) {
      persistentParams = {};
    }

    delete persistentParams[key];
  },

  /**
   * get current default configuration for `Request`
   * @returns {Object}
   */
  getConfig: function() {
    return settings;
  }
};