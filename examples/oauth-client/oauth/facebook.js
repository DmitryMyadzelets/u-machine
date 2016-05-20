/*jslint browser: false*/
'use strict';

module.exports.urls = function (opt) {
    return {
        redirect: 'https://www.facebook.com/dialog/oauth?'
                + '&client_id=' + opt.client
                + '&redirect_uri=' + opt.callback,
        token: 'https://graph.facebook.com/v2.5/oauth/access_token?'
                + '&client_id=' + opt.client
                + '&client_secret=' + opt.secret
                + '&redirect_uri=' + opt.callback
                + '&code=',
        user: 'https://graph.facebook.com/v2.5/me?'
                + 'access_token='
    };
};


module.exports.states = function () {
    return {
        initial: function (req, ignore) { // Wait for code from facebook
            this.request(this.urls.token + req.query.code); // Get access token
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
