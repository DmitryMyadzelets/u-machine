/*jslint browser: false*/
'use strict';

var machine = require('../index');

// Define the state machine
var definition = {
    initial: function () {
        return this.states.locked;
    },
    states: {
        locked: function (event) {
            switch (event) {
            case 'coin':
                return this.states.unlocked;
            }
        },
        unlocked: function (event) {
            switch (event) {
            case 'push':
                return this.states.locked;
            }
        }
    },
    transition: function (event) {
        console.log('transition:', this.prior.named, event, this.current.named);
    }
};

// Optional. Name anonymous state functions to log them during transitions
machine.nameFunctions(definition.states);

// Create the state machine
var turnstile = machine(definition);

turnstile('coin'); // transition: locked coin unlocked
turnstile('push'); // transition: unlocked push locked
turnstile('push'); // transition: locked push locked
