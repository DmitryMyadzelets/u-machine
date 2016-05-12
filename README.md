# u-machine

Finite state machine micro helper for Node.js

Based on the [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) principles, the core of this module is just a couple of functions. Just look at [the source code](https://github.com/DmitryMyadzelets/u-machine/blob/master/index.js).

# How to use

Create a finite state machine, passing an object to it. The object must contain an object propety `states`. Each state should be a function. The initial state must also be defined. There are two ways to do it. One way is to name any state as `initial`:

```javascript

    var mini = machine({
        states: {
            initial: function () {
                // your code
            }
        }
    });

```

Second way to define an initial state is to create `initial` function which would return it:

    ```javascript
    var mini = machine({
        initial: function () {
            return this.states.stop;
        },
        states: {
            stop: function () {
                // your code
            }
        }
    });
    ```

Below is a simple example for a coin-operated turnstile.

```javascript
// Define the state machine
var definition = {
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
        unlocked: function (event) {
            switch (event) {
            case 'push':
                return this.states.locked;
            }
        }
    },
    transition: function (event) {
        console.log('transition:', this.prior.named, event, this.current.named);
    }
};

// Optional. Name anonymous state functions to log them during transitions
machine.nameFunctions(definition.states);

// Create the state machine
var turnstile = machine(definition);

turnstile('coin'); // transition: locked coin unlocked
turnstile('push'); // transition: unlocked push locked
turnstile('push'); // transition: locked push locked
```
