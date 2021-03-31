'use strict';

const _ = require('lodash');
const qs = require('qs');
const axios = require('axios');

/**
 * Custom HTTP Client
 * Based on: /twilio/lib/base/RequestClient.js
 */
class MyRequestClient {
  constructor(timeout) {
    this.timeout = timeout;
  }

  request(opts) {
    opts = opts || {};

    if (!opts.method) {
      throw new Error('http method is required');
    }

    if (!opts.uri) {
      throw new Error('uri is required');
    }

    // Axios auth option will use HTTP Basic auth by default
    if (opts.username && opts.password) {
      this.auth = {
        username: opts.username,
        password: opts.password,
      };
    }

    // Options for axios config
    const options = {
      url: opts.uri,
      method: opts.method,
      headers: opts.headers,
      auth: this.auth,
      timeout: this.timeout,
    };

    // Use 'qs' to support x-www-form-urlencoded with axios
    // Construct data request body option for axios config
    if (!_.isNull(opts.data)) {
      options.headers = { 'content-type': 'application/x-www-form-urlencoded' };
      options.data = qs.stringify(opts.data, { arrayFormat: 'repeat' });
    }

    // Use 'qs' to support x-www-form-urlencoded with axios
    // Construct URL params option for axios config
    if (!_.isNull(opts.params)) {
      options.params = opts.params;
      options.paramsSerializer = (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }

    return axios(options)
      .then((response) => {
        if (opts.logLevel === 'debug') {
          console.log(`response.statusCode: ${response.status}`);
          console.log(`response.headers: ${JSON.stringify(response.headers)}`);
        }
        return {
          statusCode: response.status,
          body: response.data,
        };
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

module.exports = MyRequestClient;
