# Finite state machine micro helper for Node.js

If you need a state-machine-like behavior, and feel that great frameworks like [the one of Jake Gordon](https://github.com/jakesgordon/javascript-state-machine), [_machina_ of Jim Cowart](https://github.com/ifandelse/machina.js) or [_Stately.js_
 of Florian Schäfer](https://github.com/fschaefer/Stately.js) is too much for you, then this helper may be just what you are looking for.

Based on the [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) principles, the core of this module is just [a couple of functions](https://github.com/DmitryMyadzelets/u-machine/blob/master/index.js).

## Use cases

- [OAuth client for authorization with Facebook](https://github.com/DmitryMyadzelets/u-machine/tree/master/examples/oauth-client), Google, Yandex and Vkontakte.

# How to use

    npm install u-machine

```javascript
var machine = require('u-machine');
```
Pass any object to the `machine`. It returns a function which will be the only entry point for events. The object is required to have just one property `states` with states defined as functions:

```javascript
{
    states: {
        initial: function () {},
        // ...
        any_name: function () {}
    }
}
```

The machine creates other properties:

    current - A current state function
    prior   - The last state function the machine made a transition from
    machine - Reference to the machine itself

## Running

Run the machine passing events to it. Events may be just any stuff you want. The machine passes all parameters you throw to it to a function corresponding to the current state.

```javascript
var mini = machine({...});
mini(); // event is undefined
mini({}, [], function () {});
```

## Initial state

The definition of initial state for the state machine is required. There are two ways to define the initial state. One way is to name any state as `initial`:

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

If the both ways are mixed then the `initial` state will be used:

```javascript
var mini = machine({
    initial: function () {
        console.log('This function will not be called');
    },
    states: {
        initial: function () {
            console.log('The initial state');
        }
    }
});

mini(); // The initial state
```

## Current state

You may wonder how to get the current state the machine at. Since the states are the functions you may use named state function and then use `.current.name` property (make sure it's [supported](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)). Alternatively, if you use anonymous functions, you can pass states to `machine.deanonymize` method. It creates `named` properties equal the states functions names.

```javascript
var o = {
    states: {
        initial: function () {},
        final: function () {}
    }
};

machine.deanonymize(o.states); // [ 'initial', 'final' ]
machine(o);

o.current.named; // 'initial'
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

In state functions the keyword `this` always refers to the object you created the machine with:

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
        initial: function (o) {
            o.n += 1;
        }
    },
    transition: function (o) {
        console.log(o.n);
    }
});

mini({n: 1}); // 2
```

## Logging (debugging) transitions

Inside the transition function the keyword `this` refers to the object with states description. The machine jumps from the `this.prior` state to the `this.current` state. However, if states are anonymous functions, it is hard to understand which actually the prior and current states are.

Here is a solution you may use:

```javascript
var obj = {
    states: {
        initial: function () {
            return this.states.run;
        },
        run: function () {}
    },
    transition: function () {
        console.log('transition from', this.prior.named,
                'to', this.current.named);
    }
};
var mini = machine(obj);

machine.deanonymize(obj.states);

mini(); // transition from initial to run
mini(); // transition from run to run
```

The `deanonymize` method creates properties for functions with the same values as the object's keys. You can change default property name `named` to another passing it as a second argument:

```javascript
machine.deanonymize(obj.states, 'stateName');
```

## External and internal events

Let's say we want the machine to count up to 10. Below is the example where we both control the counter and fire events externally:

```javascript
var obj = {
    counter: 0,
    states: {
        initial: function () {
            return this.states.run;
        },
        run: function () {
            this.counter += 1;
        }
    },
    transition: function () {
        console.log(this.counter);
    }
};

var mini = machine(obj);

while (obj.counter < 10) {
    mini();
}
// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

It may be more convenient to let the machine control the logic, and fire events to itself internally. The events entry function is accessible by the `machine` property:

```javascript
var mini = machine({
    counter: 0,
    states: {
        initial: function () {
            setImmediate(this.machine);
            return this.states.run;
        },
        run: function () {
            this.counter += 1;
            if (this.counter < 10) {
                setImmediate(this.machine);
            }
        }
    },
    transition: function () {
        console.log(this.counter);
    }
});

mini(); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```
Another way, where we fire events at a single point:

```javascript
var mini = machine({
    counter: 0,
    states: {
        initial: function () {
            return this.states.run;
        },
        run: function () {
            this.counter += 1;
        }
    },
    transition: function () {
        console.log(this.counter);
        if (this.counter < 10) {
            setImmediate(this.machine);
        }
    }
});

mini(); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

