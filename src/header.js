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
    addParams: true,
    throttle: false
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
  persistentParams = {},

  /**
   * used as a key / store to monitor duplicate and pending outgoing requests for the same data
   * @type {Object}
   */
  throttle = {},

  /**
   * log identifier
   * @type {string}
   */
  TAG = 'Endpoint::';

/**
 * creates a basic auth header
 * @param username {String}
 * @param password {String}
 * @returns {String}
 */
function constructBasicAuthHeader(username, password) {
  var
    toEncode = username + ':' + password,
    encoded = util.encodeBase64(toEncode),
    token = 'Basic ' + encoded;

  return token;
}
