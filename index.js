(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.SnapScan = factory();
  }
}(this, function() {
  'use strict';

  const request = require('request')

  function SnapScan({ apiKey, merchant }) {
    if (!apiKey) {
      throw new Error('Missing or invalid api key.')
    }

    if (!merchant) {
      throw new Error('Missing or invalid merchant.')
    }

    this.__apiKey = apiKey;
    this.__merchant = merchant;
    this.__baseURL = `https://pos.snapscan.io/${merchant}/api/v1`
    this.__qrCodeBaseURL = 'https://pos.snapscan.io/qr/'
  }

  const addQueryParam = (url, param, value) => {
    const delimiter = /\?/.test(url) ? '&' : '?'
    return `${url}${delimiter}${param}=${value}`
  }

  /////////////////////////////////////////
  // QR CODES
  /////////////////////////////////////////
  SnapScan.prototype.getQRCode = function(options = {}) {
    const opts = options
    const snapCode = options.snapCode || this.__merchant
    const id = options.id
    const amount = options.amount
    const strict = options.strict
    const snapCodeType = options.snapCodeType || 'svg'
    const snapCodeSize = options.snapCodeSize || 125
    const validsnapCodeTypes = [ 'svg', 'png' ]
    const standardParams = [ 'snapCode', 'id', 'amount', 'strict', 'snapCodeType', 'snapCodeSize' ]

    if (validsnapCodeTypes.indexOf(snapCodeType) < 0) {
      return Promise.reject(new Error('"snapCodeType" must be either "svg" or "png". Default is "svg".'))
    }

    if (snapCodeSize < 50 || snapCodeSize > 500) {
      return Promise.reject(new Error('"snapCodeSize" must be between 50 and 500. Default is 125.'))
    }

    const response = {
      urlLink: `${this.__qrCodeBaseURL}${snapCode}`,
      imageLink: `${this.__qrCodeBaseURL}${snapCode}.${snapCodeType}`
    }

    if (id) {
      response.urlLink = addQueryParam(response.urlLink, 'id', id)
      response.imageLink = addQueryParam(response.imageLink, 'id', id)
    }

    if (amount) {
      response.urlLink = addQueryParam(response.urlLink, 'amount', amount)
      response.imageLink = addQueryParam(response.imageLink, 'amount', amount)
    }

    if (strict) {
      response.urlLink = addQueryParam(response.urlLink, 'strict', strict)
      response.imageLink = addQueryParam(response.imageLink, 'strict', strict)
    }

    if (snapCodeSize) {
      response.imageLink = addQueryParam(response.imageLink, 'snap_code_size', snapCodeSize)
    }

    // Add any extra passed params to QR Code
    for (const option in opts) {
      if (standardParams.indexOf(option) < 0) {
        response.urlLink = addQueryParam(response.urlLink, option, opts[option])
        response.imageLink = addQueryParam(response.imageLink, option, opts[option])
      }
    }

    return Promise.resolve(response)
  }

  /////////////////////////////////////////
  // Payments
  /////////////////////////////////////////
  SnapScan.prototype.getPayments = function(query = {}) {
    return new Promise((resolve, reject) => {
      this.request({
        path: 'payments',
        query
      })
        .then(resolve)
        .catch(reject)
    })
  }

  SnapScan.prototype.getPayment = function(id) {
    return new Promise((resolve, reject) => {
      this.request({
        path: `payments/${id}`
      })
        .then(resolve)
        .catch(reject)
    })
  }

  SnapScan.prototype.getCashUpPayments = function(ref) {
    if (!ref) {
      return Promise.reject(new Error('The cash up period\'s reference is required'))
    }

    return new Promise((resolve, reject) => {
      this.request({
        path: `payments/cash_ups/${ref}`
      })
        .then(resolve)
        .catch(reject)
    })
  }

  /////////////////////////////////////////
  // Cash Ups
  /////////////////////////////////////////
  SnapScan.prototype.cashUp = function() {
    return new Promise((resolve, reject) => {
      this.request({
        path: 'cash_ups',
        method: 'POST'
      })
        .then(resolve)
        .catch(reject)
    })
  }

  SnapScan.prototype.getCashUps = function(query = {}) {
    return new Promise((resolve, reject) => {
      this.request({
        path: 'cash_ups',
        query
      })
        .then(resolve)
        .catch(reject)
    })
  }

  SnapScan.prototype.request = function(options) {
    if (!options) {
      return Promise.reject(new Error("No request options given"));
    }

    const method = options.method || 'GET'
    const path = options.path || ''
    const url = options.url
    const qs = options.query

    return new Promise((resolve, reject) => {
      request({
        method,
        url: url || `${this.___baseURL}${path}`,
        auth: {
          user: this.__apiKey,
          pass: ''
        },
        json: true,
        qs
      }, (error, response, body) => {
        if (error) {
          reject(error)
          return
        }
        resolve(body)
      })
    })
  }

  return SnapScan;
}));
