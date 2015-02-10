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

/**
 * configures the HTTP request
 * @param options
 * @returns {Request}
 */
Request.prototype.config = function(options) {
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

/**
 * constructs and performs the HTTP request
 * @returns {$q.promise}
 */
Request.prototype.execute = function() {
  var
    deferred = $q.defer(),
    options = this.options,
    url = options.url || (options.baseUrl || '') + (options.path || ''),
    throttleKey;

  if (options.map) {
    url = util.mapStrings(url, options.map);
  }

  if (options.addHeaders) {
    var copyOfPersistentHeaders = angular.copy(persistentHeaders);
    options.headers = angular.extend(copyOfPersistentHeaders, options.headers || {});
  }

  if (options.addParams) {
    var copyOfPersistentParams = angular.copy(persistentParams);
    options.params = angular.extend(copyOfPersistentParams, options.params || {});
  }

  if (options.basicAuth) {
    if (options.basicAuth instanceof Array) {
      if (options.basicAuth.length !== 2) {
        deferred.reject('Must pass two items in `basicAuth` array.');
        return deferred.promise;
      }

      options.headers.Authorization = constructBasicAuthHeader(
        options.basicAuth[0],
        options.basicAuth[1]
      );
    } else {
      deferred.reject('Must pass array to `basicAuth` function.');
      return deferred.promise;
    }
  }

  if (options.throttle) {
    throttleKey = options.method + url;
    if (options.headers) throttleKey += JSON.stringify(options.headers);
    if (options.params) throttleKey += JSON.stringify(options.params);

    if (throttle[throttleKey]) {
      $log.debug(TAG + 'Request::execute', 'Throttling request.');
      return throttle[throttleKey];
    }
  }

  throttle[throttleKey] = deferred.promise;

  delete options.map;
  delete options.throttle;
  delete options.basicAuth;
  delete options.addParams;
  delete options.addHeaders;

  $http({
    method: options.method,
    url: url,
    data: options.data,
    params: options.params,
    headers: options.headers,
    file: options.file || null
  }).then(function(response) {
    delete throttle[throttleKey];

    try {
      return deferred.resolve(response.data || response);
    } catch (e) {
      $log.debug('Error parsing response.', e);
      return deferred.resolve(response);
    }
  }, function(error) {
    delete throttle[throttleKey];
    return deferred.reject(error);
  });

  return deferred.promise;
};
