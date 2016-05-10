/*jslint browser: false*/
'use strict';

var machine = require('../index');

machine({
    initial: function () {
        return this.states.green;
    },
    states: {
        green: function (event) {
            switch (event) {
            case 'panic':
                return this.states.red;
            case 'warn':
                return this.states.yellow;
            }
        },
        yellow: function (event) {
            switch (event) {
            case 'panic':
                return this.states.red;
            case 'clear':
                return this.states.green;
            }
        },
        red: function (event) {
            switch (event) {
            case 'calm':
                setTimeout(this.machine, 3000);
                return this.states.yellow;
            case 'clear':
                setTimeout(this.machine, 3000);
                return this.states.green;
            }
        }
    }
});
