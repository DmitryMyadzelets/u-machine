/*jslint browser: false*/
/*global describe, it, expect*/
'use strict';


const u = require('../index');


describe('The module itself', function () {

    it('Is a function', function () {
        expect(typeof u).toBe('function');
    });

    it('Has a function "deanonymize"', function () {
        expect(typeof u.deanonymize).toBe('function');
    });
});


describe('The module is a machine constructor which', function () {

    it('Requires an object', function () {
        expect(function () {
            u();
        }).toThrow();
    });

    it('Requires an object with "states.initial" function', function () {
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

    it('If no "initial" state function, requires "initial" object\'s function', function () {
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