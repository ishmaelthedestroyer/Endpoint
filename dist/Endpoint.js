app.service("Endpoint", [
"$http",
"$q",
"$log",
function($http, $q, $log) {

'use strict';

var

  /**
   * default settings for every request
   * @type {Object}
   */
  settings = {
    method: 'GET',
    baseUrl: '',
    params: null,
    data: null,
    headers: {},
    onSuccess: null,
    onError: null,
    addHeaders: true,
    addParams: true
  },

  /**
   * headers sent with every request
   * @type {object}
   */
  persistentHeaders = {},

  /**
   * get parameters sent with every request
   * @type {object}
   */
  persistentParams = {};
/**
 *
 * @param options
 * @returns {Request}
 * @constructor
 */
var Request = function(options) {
  if (!(this instanceof Request)) {
    return new Request(options);
  }

  if (options) {
    this.config(options);
  }

  return this;
};

Request.prototype.config = function(options) {
  // TODO: ...

  options = angular.extend(angular.copy(settings), options || {});

  if (options.onSuccess) {
    options._onSuccess = options.onSuccess;
  }

  if (options.onError) {
    options._onError = options.onError;
  }

  options.onSuccess = function(data) {
    // TODO: handle success

    if (this._onSuccess && typeof this._onSuccess === 'function') {
      this._onSuccess(data);
    }
  };

  options.onError = function(data) {
    // TODO: handle error

    if (this._onError && typeof this._onError === 'function') {
      this._onError(data);
    }
  };

  this.options = options;

  return this;
};

Request.prototype.execute = function() {
  var
    deferred = $q.defer(),
    options = this.options,
    url = options.url || (options.baseUrl || '') + (options.path || '');

  if (options.addHeaders) {
    var copyOfPersistentHeaders = angular.copy(persistentHeaders);
    options.headers = angular.extend(copyOfPersistentHeaders, options.headers || {});
  }

  if (options.addParams) {
    var copyOfPersistentParams = angular.copy(persistentParams);
    options.params = angular.extend(copyOfPersistentParams, options.params || {});
  }

  // delete options.url;
  // delete options.path;
  delete options.addParams;
  delete options.addHeaders;

  $http({
    method: options.method,
    url: url,
    data: options.data,
    params: options.params,
    headers: options.headers
  }).then(function(response) {
    try {
      return deferred.resolve(response.data || response);
    } catch (e) {
      $log.debug('Error parsing response.', e);
      return deferred.resolve(response);
    }
  }, function(error) {
    return deferred.reject(error);
  });

  return deferred.promise;
};

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

}
]);