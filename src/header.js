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