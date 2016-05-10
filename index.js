/*jslint browser: false*/
'use strict';

// ============================================================================
// Extentions

// Creates o[Function].named = function name for each function of the object
function nameFunctions(o) {
    if (o) {
        Object.keys(o).forEach(function (key) {
            if (typeof o[key] === 'function') {
                o[key].named = key;
            }
        });
    }
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
    nameFunctions(o.states);
    o.current = o.states.initial || o.initial();
    o.machine = f;
    return f;
}


constructor.nameFunctions = nameFunctions;

module.exports = constructor;