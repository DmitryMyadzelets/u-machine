/*jslint browser: false*/
'use strict';

// Help
//
// Site authorization: https://tech.yandex.ru/oauth/doc/dg/reference/auto-code-client-docpage/
// access_token is valid for 1 year!

module.exports.urls = function (opt) {
    return {
        redirect: 'https://oauth.yandex.com/authorize?'
                + '&response_type=code'
                + '&client_id=' + opt.client,
        token: '' // For Yandex it is used as POST method body
                + '&grant_type=authorization_code'
                + '&client_id=' + opt.client
                + '&client_secret=' + opt.secret
                + '&code=',
        user: 'https://login.yandex.ru/info?'
                + 'oauth_token='
    };
};


module.exports.states = function () {
    return {
        initial: function (req, ignore) { // Wait for code from facebook
            this.request({
                method: 'POST',
                uri: 'https://oauth.yandex.ru/token',
                body: this.urls.token + req.query.code
            }); // Get access token
            return this.states.token;
        },
        token: function (err, obj) { // Wait for access token
            if (err) {
                this.done(err);
                return this.states.error;
            }
            this.request(this.urls.user + obj.access_token); // Get user info
            return this.states.user;
        },
        user: function (err, obj) { // Wait for user info
            if (err) {
                this.done(err);
                return this.states.error;
            }
            this.done(null, obj);
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
