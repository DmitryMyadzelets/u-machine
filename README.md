# u-machine

Finite state machine micro helper for Node.js

Based on the <abbr tytle="Keep it simple, stupid">KISS</abbr> and <abbr tytle="You aren't gonna need it">YAGNI</abbr> principles, the core of this module is just a couple of functions. Just look at the code.

Below is a simple example for a coin-operated turnstile.

```javascript
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
```
