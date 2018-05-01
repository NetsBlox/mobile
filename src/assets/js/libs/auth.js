'use strict';
/* global hex_sha512 */

/* NetsBlox client authentication library
 * Find the latest version in the github repo:
 * https://github.com/NetsBlox/client-auth
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthHandler = function () {
  function AuthHandler(serverUrl) {
    _classCallCheck(this, AuthHandler);

    if (serverUrl.endsWith('/')) serverUrl = serverUrl.substr(0, serverUrl.length - 1);
    this.serverUrl = serverUrl;
  }

  _createClass(AuthHandler, [{
    key: '_requestPromise',
    value: function _requestPromise(request, data) {
      return new Promise(function (resolve, reject) {
        // stringifying undefined => undefined
        if (data) {
          request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        }
        request.send(JSON.stringify(data));
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300) {
              resolve(request);
            } else {
              var err = new Error(request.statusText || 'Unsuccessful Xhr response');
              err.request = request;
              reject(err);
            }
          }
        };
      });
    }
  }, {
    key: 'login',
    value: function login(username, password) {
      var request = new XMLHttpRequest();
      request.open('POST', this.serverUrl + '/api', true);
      request.withCredentials = true;
      var data = {
        __u: username,
        __h: hex_sha512(password)
      };
      return this._requestPromise(request, data);
    }
  }, {
    key: 'logout',
    value: function logout() {
      var request = new XMLHttpRequest();
      request.open('POST', this.serverUrl + '/api/logout', true);
      request.withCredentials = true;
      return this._requestPromise(request);
    }
  }, {
    key: 'checkLogin',
    value: function checkLogin() {
      var request = new XMLHttpRequest();
      request.open('POST', this.serverUrl + '/api', true);
      request.withCredentials = true;
      return this._requestPromise(request);
    }

    // gets user info: username, email

  }, {
    key: 'getProfile',
    value: function getProfile() {
      var request = new XMLHttpRequest();
      request.open('POST', this.serverUrl + '/api', true);
      request.withCredentials = true;
      var data = {
        api: false,
        return_user: true,
        silent: true
      };
      return this._requestPromise(request, data).then(function (res) {
        if (!res.responseText) throw new Error('Access denied. You are not logged in.');
        var user = JSON.parse(res.responseText);
        return user;
      });
    }
  }]);

  return AuthHandler;
}();