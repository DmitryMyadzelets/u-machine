/*jslint browser: false*/
'use strict';

var express = require('express');
var Provider = require('./oauth/provider');

var port = 3000;
var app = express();


// Configure the provider with the data you and facebook agreed about:
// https://developers.facebook.com/docs/apps/register
// Create configuration file containig your configuration:
// {
//     "client": "your app id provided by facebook",
//     "secret": "your app secret provided by facebok",
//     "callback": "http://url_to_your_app:3000/auth/facebook"
// }
var google = new Provider('google', require('./oauth/.google.json'));
var yandex = new Provider('yandex', require('./oauth/.yandex.json'));
var facebook = new Provider('facebook', require('./oauth/.facebook.json'));
var vkontakte = new Provider('vkontakte', require('./oauth/.vkontakte.json'));


function provider(req, res) {
    res.json(req.error || req.provider);
}

app.get('/', facebook.redirect);
app.get('/auth/google', google.authorize, provider);
app.get('/auth/yandex', yandex.authorize, provider);
app.get('/auth/facebook', facebook.authorize, provider);
app.get('/auth/vkontakte', vkontakte.authorize, provider);


app.listen(port, function () {
    console.log('Server listening on port', port);
});
