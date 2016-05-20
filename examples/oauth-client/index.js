/*jslint browser: false*/
'use strict';

var express = require('express');
var Provider = require('./oauth/provider');

var port = 5003;
var app = express();


// Configure the provider with the data you and facebook agreed about:
// https://developers.facebook.com/docs/apps/register
var facebook = new Provider('facebook', require('./oauth/.facebook.json'));


function provider(req, res) {
    res.json(req.error || req.provider);
}

app.get('/', facebook.redirect);
app.get('/auth/facebook', facebook.authorize, provider);


app.listen(port, function () {
    console.log('Server listening on port', port);
});
