/*jslint browser: false*/
/*global describe, it, expect, beforeEach*/
'use strict';


const u = require('../index');


describe('The module itself', function () {

    it('is a function', function () {
        expect(typeof u).toBe('function');
    });

    it('has a function "deanonymize"', function () {
        expect(typeof u.deanonymize).toBe('function');
    });
});


describe('The module is a machine constructor which', function () {

    it('requires an object with "states.initial" function', function () {
        expect(function () {
            u();
        }).toThrow();

        expect(function () {
            u({});
        }).toThrow();

        expect(function () {
            u({
                states: {
                    initial: undefined
                }
            });
        }).toThrow();

        expect(function () {
            u({
                states: {
                    initial: function () {
                        return;
                    }
                }
            });
        }).not.toThrow();
    });

    it('requires "initial" function if there is no "states.initial" function', function () {
        expect(function () {
            u({
                states: {},
                initial: undefined
            });
        }).toThrow();

        expect(function () {
            u({
                states: {},
                initial: function () {
                    return;
                }
            });
        }).not.toThrow();
    });
});


describe('Machine constructor, given an object,', function () {
    var o = {
        states: {
            initial: function () {
                return this.states.final;
            },
            final: function () {
                return;
            }
        }
    };
    var m;

    beforeEach(function () {
        m = u(o);
    });

    it('creates property "current"', function () {
        expect(typeof o.current).toBe('function');
        expect(o.states.initial === o.current).toBe(true);
    });

    it('creates property "prior", after first run', function () {
        expect(typeof o.prior).toBe('undefined');
        m();
        expect(typeof o.prior).toBe('function');
        expect(o.states.initial === o.prior).toBe(true);
        expect(o.states.final === o.current).toBe(true);
    });

    it('creates property "machine", a reference to the machine itself', function () {
        expect(typeof o.machine).toBe('function');
        expect(m === o.machine).toBe(true);
    });

});


describe('Bad design of machine with callbacks to itself', function () {
    function request(callback) {
        callback();
    }

    var bad = {
        states: {
            initial: function () {
                request(this.machine);
                return this.states.final;
            },
            final: function () {
                this.done = true;
                return;
            }
        }
    };

    it('cant avoid race condition', function () {
        var m = u(bad);
        expect(function () {
            m();
        }).toThrow();
    });

});


describe('Good design of machine with callback to itself', function () {
    function external(callback) {
        callback();
    }

    var good = {
        states: {
            initial: function () {
                var self = this;
                setTimeout(function () {
                    external(self.machine);
                });
                return this.states.final;
            },
            final: function () {
                this.done = true;
                return;
            }
        }
    };

    it('avoids race condition with setTimeout', function (done) {
        u(good)();

        expect(good.current === good.states.final).toBe(true);

        // Make test asynchronous since the machine is asynchronous too
        setTimeout(function () {
            expect(good.done).toBe(true);
            done();
        });
    });
});


describe('Best design of machine with callbacks to itself', function () {
    // This design is better since
    // it doesn't create functions inside of states.

    function external(callback) {
        callback();
    }

    var best = {
        internal: function () {
            external(this.machine);
        },
        states: {
            initial: function () {
                setTimeout(this.internal);
                return this.states.final;
            },
            final: function () {
                this.done = true;
                return;
            }
        }
    };

    it('avoids race condition with an asynchronous helper', function (done) {
        best.internal = best.internal.bind(best);
        u(best)();

        expect(best.current === best.states.final).toBe(true);
        // Make test asynchronous since the machine is asynchronous too
        setTimeout(function () {
            expect(best.done).toBe(true);
            done();
        });
    });
});
