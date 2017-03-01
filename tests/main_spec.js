/*jslint browser: false*/
/*global describe, it, expect*/
'use strict';


const u = require('../index');


describe('The module itself', function () {

    it('Is a function', function () {
        expect(typeof u).toBe('function');
    });

    it('Has a member function "deanonymize"', function () {
        expect(typeof u.deanonymize).toBe('function');
    });
});


describe('The module is a machine constructor which', function () {

    it('Requires an object', function () {
        expect(function () {
            u();
        }).toThrow();
    });


    it('Requires an object with "initial" property', function () {
        expect(function () {
            u({});
        }).toThrow();
    });

    it('Requires an "initial" state function', function () {
        expect(function () {
            u({
                states: {
                    initial: undefined
                }
            });
        }).toThrow();
    });

    it('Requires an "initial" state function', function () {
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
    });


    it('If no "initial" state function, requires "initial" object\'s function', function () {
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