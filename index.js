/*jslint browser: false*/
'use strict';


// ============================================================================

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


module.exports = constructor;