/*jslint browser: false*/
'use strict';

var machine = require('../index');

machine({
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
        unloked: function (event) {
            switch (event) {
            case 'push':
                return this.states.locked;
            }
        }
    }
});
