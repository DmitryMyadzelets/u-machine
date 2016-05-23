/*jslint browser: false*/
'use strict';

// Help
//
// Vkontakte site authorization: http://vk.com/dev/auth_sites
// access_token is valid for 24 hours


module.exports.urls = function (opt) {
    return {
        redirect: 'https://oauth.vk.com/authorize?'
                + '&v=5.50'
                + '&display=mobile'
                + '&scope=email'
                + '&client_id=' + opt.client
                + '&redirect_uri=' + opt.callback,
        token: 'https://oauth.vk.com/access_token?'
                + '&v=5.50'
                + '&client_id=' + opt.client
                + '&client_secret=' + opt.secret
                + '&redirect_uri=' + opt.callback
                + '&code='
        // user: 'https://api.vk.com/method/users.get?'
        //         + '&v=5.50'
        //         + '&fields=sex,bdate,photo_max_orig'
        //         + '&access_token='
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
