// Test specification for multiple instances of one state machine

const u = require('..')

describe('The machine module itself', function () {

    it('is a function', function () {
        expect(typeof u).toBe('function')
    })
})

describe('The machine', function () {
    const o = {
        states: {
            initial: function () {
                return this.states.final
            },
            final: function () {
                this.checked = true
            }
        }
    }

    it('supports multiple instances', function () {
        const o1 = Object.create(o)
        const o2 = Object.create(o)
        const f1 = u(o1)
        const f2 = u(o2)

        expect(o1.current).toBe(o1.states.initial)
        expect(o2.current).toBe(o2.states.initial)

        f1()

        expect(o1.current).toBe(o1.states.final)
        expect(o2.current).toBe(o2.states.initial)

        f2()

        expect(o2.current).toBe(o2.states.final)
        
        expect(o1.checked).toBe(undefined)
        expect(o2.checked).toBe(undefined)

        f1()

        expect(o1.checked).toBe(true)
        expect(o2.checked).toBe(undefined)

        f2()

        expect(o2.checked).toBe(true)
  })
})

