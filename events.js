// Type validation functions for events
const types = [
    v => v instanceof Function,
    v => v instanceof Array,
    v => v == undefined || v instanceof Object 
]

function validate(machine, names, o) {
    if (!types.every((valid, i) => valid(arguments[i]))) {
        throw new Error('Expected events(Function, Array [,Object]) call')
    }
    if (!names.every(name => typeof name == 'string')) {
        throw new Error('The events\' names must be strings')
    }
    names.forEach(name => {
        if (o[name] !== undefined) {
            throw new Error(`The event "${name}" is already defined`)
        }
    })
}

// Creates functions with given names which invoke machine function
// Returns the given object with the events functions
function events(machine, names, o) {
    names.forEach(name => o[name] = machine.bind(undefined, name))
    return o
}

module.exports = function (machine, names, o) {
    o = o || machine
    validate(machine, names, o)
    return events(machine, names, o)
}
