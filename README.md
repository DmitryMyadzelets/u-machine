# u-machine

Finite state machine micro helper for Node.js

Based on the [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) principles, the core of this module is just a couple of functions. Just look at [the source code](https://github.com/DmitryMyadzelets/u-machine/blob/master/index.js).

# How to use

Create a finite state machine, passing an object to it. The object must contain an object property `states`. Each state should be a function. The initial state must also be defined. 

## Initial state

There are two ways to define the initial state. One way is to name any state as `initial`:

```javascript
machine({
    states: {
        initial: function () {
            // some code
        }
    }
});
```

Another way is to create `initial` function which returns the initial state:

```javascript
machine({
    initial: function () {
        return this.states.stop;
    },
    states: {
        stop: function () {
            // some code
        }
    }
});
```

If the both ways are mixed, then the `initial` state will be used.

```javascript
var mini = machine({
    initial: function () { // this function will not be called
        console.log('Second');
    },
    states: {
        initial: function () {
            console.log('First');
        }
    }
});

mini(); // First
```

## Running

Run the machine passing events to it. Events may be just any stuff you want. The machine passes all parameters you throw to it to a function corresponding to the current state.

```javascript
var mini = machine({...});
mini(); // event is undefined
mini({}, [], function () {});
```
## Transitions

To make a transition the current state should return a state the machine makes transition to. If no state is returned then the machine remains at the same state.

```javascript
var mini = machine({
    initial: function () {
        return this.states.stop;
    },
    states: {
        stop: function () {
            // some code
            return this.states.run;
        },
        run: function () {
            // some code
        }
    }
});

// The current state is 'stop'
mini(); // Makes transition from 'stop' to 'run'
mini(); // Makes transition from 'run' to 'run'
```

In state functions `this` always refers to the object you created the machine with.

```javascript
var obj = {
    states: {
        initial: function () {
            console.log(this === obj);
        }
    }
};

var mini = machine(obj);

mini(); // true
mini.call({}); // true
```

# Examples

Simple example for a coin-operated turnstile:

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
