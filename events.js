// Check if name is not defined already
function valid(name) {
    if (this[name] !== undefined) {
        throw new Error(`The event "${name}" is already defined`)
    }
}

// Creates functions with given names which invoke the machine function
// Returns the given object with the events functions
function events(machine, names, o) {
    o = o || machine
    names.forEach(valid, o)
    names.forEach(name => o[name] = machine.bind(undefined, name))
    return o
}

module.exports = events
