'use strict';

var _ = require('lodash');
var http = require('request');
var Q = require('q');
var Response = require('twilio/lib/http/response');
var Request = require('twilio/lib/http/request');

/**
 * Custom HTTP Client
 * Based on: /twilio/lib/base/RequestClient.js
 */
class RequestClient {
  constructor(proxy = null) {
    if (proxy) {
      this.proxy = proxy;
    }
  }

  request(opts) {
    opts = opts || {};
    if (!opts.method) {
      throw new Error('http method is required');
    }

    if (!opts.uri) {
      throw new Error('uri is required');
    }

    var deferred = Q.defer();
    var headers = opts.headers || {};
    if (opts.username && opts.password) {
      var b64Auth = new Buffer(opts.username + ':' + opts.password).toString('base64');
      headers.Authorization = 'Basic ' + b64Auth;
    }

    var options = {
      timeout: opts.timeout || 30000,
      followRedirect: opts.allowRedirects || false,
      url: opts.uri,
      method: opts.method,
      headers: opts.headers,
      forever: opts.forever === false ? false : true,
      proxy: this.proxy
    };

    if (!_.isNull(opts.data)) {
      options.formData = opts.data;
    }

    if (!_.isNull(opts.params)) {
      options.qs = opts.params;
      options.useQuerystring = true;
    }

    var optionsRequest = {
      method: options.method,
      url: options.url,
      auth: b64Auth || null,
      params: options.qs,
      data: options.formData,
      headers: options.headers,
    };

    var that = this;
    this.lastResponse = undefined;
    this.lastRequest = new Request(optionsRequest);

    http(options, function (error, response) {
      if (error) {
        that.lastResponse = undefined;
        deferred.reject(error);
      } else {
        that.lastResponse = new Response(response.statusCode, response.body);
        deferred.resolve({
          statusCode: response.statusCode,
          body: response.body,
        });
      }
    });

    return deferred.promise;
  }
}

module.exports = RequestClient;
