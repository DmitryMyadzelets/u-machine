const u = require('..')
const e = require('../events')

describe('The events', () => {
    it('can be user-defined functions', () => {
        const o = {
            states: {
                initial: function (event) {
                    switch (event) {
                        case 'run': return this.states.run
                        default: throw new Error(`Event "${event}" is not expected in this state`)
                    }
                },
                run: function (event) {
                    switch (event) {
                        case 'stop': return this.states.initial
                        default: throw new Error(`Event "${event}" is not expected in this state`)
                    }
                }
            }
        }

        const m = u(o)
        const events = ['run', 'stop']
        expect(typeof e).toBe('function')

        expect(() => e(m, events)).not.toThrow()

        expect(() => m()).toThrow()
        expect(() => m('run')).not.toThrow()
        expect(o.current).toBe(o.states.run)
        expect(() => m('run')).toThrow()
        expect(() => m('stop')).not.toThrow()
        expect(o.current).toBe(o.states.initial)

        expect(events.every(event => typeof m[event] == 'function')).toBe(true)
        expect(() => m.run()).not.toThrow()
        expect(o.current).toBe(o.states.run)
        expect(() => m.foo()).toThrow()
        expect(() => m.run()).toThrow()
        expect(() => m.stop()).not.toThrow()

        const proxy = e(m, events, {})
        expect(typeof proxy).toBe('object')
        expect(() => proxy.run()).not.toThrow()
        expect(() => e(m, events, proxy)).toThrow()

        expect(() => e(m, ['states'], o)).toThrow()
        expect(() => e()).toThrow()
    })
})
