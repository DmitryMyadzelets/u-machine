/*jslint browser: false*/
/*global describe, it, expect*/
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