/*jslint browser: false*/
'use strict';

var jwt = require('jwt-simple');

// Help
//
// Google site authorization: https://developers.google.com/identity/protocols/OAuth2WebServer#libraries
// JWT payload described there: https://developers.google.com/identity/protocols/OpenIDConnect#server-flow
// access_token is valid for about 2 hours

module.exports.urls = function (opt) {
    return {
        redirect: 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=profile%20email'
                + '&client_id=' + opt.client
                + '&redirect_uri=' + opt.callback,
        token: 'https://www.googleapis.com/oauth2/v4/token?'
                + '&client_id=' + opt.client
                + '&client_secret=' + opt.secret
                + '&redirect_uri=' + opt.callback
                + '&grant_type=authorization_code'
                + '&code='
    };
};


module.exports.states = function () {
    return {
        initial: function (req, ignore) { // Wait for code from facebook
            this.request({
                method: 'POST',
                uri: this.urls.token + req.query.code
            }); // Get access token
            return this.states.token;
        },
        token: function (err, obj) { // Wait for access token
            if (err) {
                this.done(err);
                return this.states.error;
            }
            // Decode payload 'id_token'
            var decoded;
            try {
                // Decode token without verification
                decoded = jwt.decode(obj.id_token, null, true);
            } catch (e) {
                this.done(e);
                return this.states.error;
            }
            this.done(null, decoded);
            return this.states.success;
        },
        success: function () { // final state
            return;
        },
        error: function () { // final state
            return;
        }
    };
};
