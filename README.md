# Finite state machine micro helper for Node.js

If you need a state-machine-like behavior and feel that great frameworks like [the one of Jake Gordon](https://github.com/jakesgordon/javascript-state-machine), [_machina_ of Jim Cowart](https://github.com/ifandelse/machina.js) or [_Stately.js_
 of Florian Schäfer](https://github.com/fschaefer/Stately.js) is too much for you, then this helper may be just what you are looking for.

    npm install u-machine

Based on the [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) principles, the core of this module is just a couple of functions. Just look at [the source code](https://github.com/DmitryMyadzelets/u-machine/blob/master/index.js).

# How to use

```javascript
var machine = require('u-machine');
```
Pass any object to the `machine`. It returns a function which will be the only entry point for events. The object is required to have just one property `states` with states defined as functions:

```javascript
{
    states: {
        initial_state: function () {},
        // ...
        just_any_name: function () {}
    }
}
```

On creation of the machine, a `current` property pointing to the current state will be added to the object you passed to. The machine also creates, after each transition, a `prior` property which refers to the state the machine was before making the transition.

## Running

Run the machine passing events to it. Events may be just any stuff you want. The machine passes all parameters you throw to it to a function corresponding to the current state.

```javascript
var mini = machine({...});
mini(); // event is undefined
mini({}, [], function () {});
```

## Initial state

The definition of initial state for state machine is required. There are two ways to define the initial state. One way is to name any state as `initial`:

```javascript
machine({
    states: {
        initial: function () {
            // some code
        }
    }
});
```

Other way is to create `initial` function which returns the initial state:

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

If the both ways are mixed, then the `initial` state will be used:

```javascript
var mini = machine({
    initial: function () { // This function will not be called
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

## Transitions

To make a transition to another state the state function should return a state the machine jumps to. If no state is returned then the machine remains at the same state.

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
            // will stay here forever
        }
    }
});

// The current state is 'stop'
mini(); // Makes transition from 'stop' to 'run'
mini(); // Makes transition from 'run' to 'run'
```

In state functions the keyword `this` always refers to the object you created the machine with.

```javascript
var obj = {
    states: {
        initial: function (text) {
            console.log(this === obj, text);
        }
    }
};

var mini = machine(obj);

mini('A'); // true 'A'
mini.call({}, 'B'); // true 'B'
```

Your machine may have many event sources. If you need to observe all of them, create a `transition` function in your object. The events you pass to the machine will also be passed to this function _after_ they are processed in the current state:

```javascript
var mini = machine({
    states: {
        initial: function (n) {
            n = 42;
        }
    },
    transition: function (n) {
        console.log(n);
    }
});

[1, 2, 3].map(mini); // 1, 2, 3
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
