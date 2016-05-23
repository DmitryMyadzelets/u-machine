/*jslint browser: false*/
'use strict';

var request = require('request');
var machine = require('u-machine');


// Sets error and data object
function done(req, next, err, obj) {
    if (err) {
        req.error = {error: err.error || err.message};
    } else {
        req.provider = obj;
    }
    next();
}

// Callback for 'request'. Checks response
function check(err, res, body) {
    if (err) {
        return this.machine(err);
    }
    var obj;
    try {
        obj = JSON.parse(body);
    } catch (e) {
        return this.machine(new Error('Failed to parse as JSON (' + e.message + ') the text: ' + body));
    }
    if (res.statusCode !== 200) {
        return this.machine(obj);
    }
    this.machine(err, obj);
}


function redirect(ignore, res) {
    res.redirect(this.urls.redirect);
}

var instances = {};

function authorize(req, res, next) {
    var o = Object.create(this); // Create instance of the finite state machine
    o.done = done.bind(o, req, next);
    o.check = check.bind(o);
    instances[this.name] += 1; // (optional) Used for logging
    o.nInstance = instances[this.name];
    machine(o)(req, res); // Foward request to the state machine
}


function Provider(name, config) {
    // Configuration
    var provider = require('./' + name);
    this.urls = provider.urls(config);
    this.states = provider.states();
    // Set keyword 'this' for callbacks
    this.redirect = redirect.bind(this);
    this.authorize = authorize.bind(this);
    // (optional) Used for logging
    this.name = name;
    instances[this.name] = 0;
    machine.deanonymize(this.states);
}


// Makes request for given url and sets callback
Provider.prototype.request = function (url) {
    request(url, this.check);
};

// Track transitions of the state machine
Provider.prototype.transition = function () {
    var to = this.current.named;
    switch (to) { // colorize some state names
    case 'success':
        to = '\x1b[32m' + to + '\x1b[0m';
        break;
    case 'error':
        to = '\x1b[31m' + to + '\x1b[0m';
        break;
    }
    console.log('' + this.nInstance,
            this.name,
            'transition from', this.prior.named,
            'to', to);
};


module.exports = Provider;
