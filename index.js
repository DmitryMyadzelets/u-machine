/*jslint browser: false*/
'use strict';

// ============================================================================
// Helpers

// Creates o[Function][name] = kinda function name for each function of the object
// Returns array with created names
function deanonymize(o, name) {
    name = name || 'named';
    var keys;
    if (o) {
        keys = Object.keys(o);
        keys.forEach(function (key) {
            if (typeof o[key] === 'function') {
                o[key][name] = key;
            }
        });
    }
    return keys || [];
}


// ============================================================================
// Core functions

// Entry function for all input events
function main() {
    this.prior = this.current;
    this.current = this.current.apply(this, arguments) || this.current;
    // Call user transition function, if defined
    if (this.transition) {
        this.transition.apply(this, arguments);
    }
}


// Returns the machine object main function. Sets the initial state as current
function constructor(o) {
    var f = main.bind(o);
    o.current = o.states.initial || o.initial();
    o.machine = f;
    return f;
}


constructor.deanonymize = deanonymize;

module.exports = constructor;