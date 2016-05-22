"use strict";
var q = require('q');
var request = require('request');
var LOGIN_ENDPOINT = 'https://login.salesforce.com/services/oauth2/authorize';
var LOGIN_ENDPOINT_SANDBOX = 'https://test.salesforce.com/services/oauth2/authorize';
var SF_TOKEN_ENDPOINT = 'https://login.salesforce.com/services/oauth2/token';
var SF_TOKEN_ENDPOINT_SANDBOX = 'https://test.salesforce.com/services/oauth2/token';
var REDIRECT_URI = 'http://localhost:8000/oauth';
var CLIENT_ID = '3MVG9OI03ecbG2Vpw3yS9_j_2ipSTm56YMo63FNoMC0ZIwtpjEnbcXH.QGtvvC_L6JVj7.T3NROmSBoxjEMz6';
var CLIENT_SECRET = '7679003541658893578';
var Auth = (function () {
    function Auth(sandbox) {
        this.sandbox = sandbox;
    }
    Auth.prototype.getRedirectUrl = function () {
        var url = this.sandbox ? LOGIN_ENDPOINT_SANDBOX : LOGIN_ENDPOINT;
        url += '?response_type=code';
        url += '&client_id=' + CLIENT_ID;
        url += '&redirect_uri=' + REDIRECT_URI;
        url += '&display=touch';
        return url;
    };
    Auth.prototype.init = function (code) {
        var _this = this;
        var deferred = q.defer();
        if (this.sandbox == true) {
            var url = SF_TOKEN_ENDPOINT_SANDBOX;
        }
        else {
            var url = SF_TOKEN_ENDPOINT;
        }
        var d = {
            grant_type: 'authorization_code',
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI
        };
        var httpCallback = function (err, d) {
            if (err) {
                deferred.reject();
                return;
            }
            var tokenData = JSON.parse(d.body);
            if (tokenData.error) {
                _this.message = tokenData.error + ' ' + tokenData.error_description;
                console.log("REJECT");
                deferred.reject();
                return;
            }
            _this.access_token = tokenData.access_token;
            _this.instance_url = tokenData.instance_url;
            deferred.resolve();
        };
        request({ url: url, method: 'POST', qs: d }, httpCallback);
        return deferred.promise;
    };
    return Auth;
}());
exports.Auth = Auth;
