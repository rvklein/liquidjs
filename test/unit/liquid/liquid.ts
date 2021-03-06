import Liquid from 'src/liquid'
import * as chai from 'chai'
import { mock, restore } from 'test/stub/mockfs'

const expect = chai.expect

describe('Liquid', function () {
  describe('#plugin()', function () {
    it('should call plugin on the instance', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('foo', x => `foo${x}foo`)
      })
      const html = await engine.parseAndRender('{{"bar"|foo}}')
      expect(html).to.equal('foobarfoo')
    })
    it('should call plugin with Liquid', async function () {
      const engine = new Liquid()
      engine.plugin(function (Liquid) {
        this.registerFilter('t', x => Liquid.isFalsy(x))
      })
      const html = await engine.parseAndRender('{{false|t}}')
      expect(html).to.equal('true')
    })
  })
  describe('#express()', function () {
    const liquid = new Liquid({ root: '/root' })
    const render = liquid.express()
    before(function () {
      mock({
        '/root/foo': 'foo'
      })
    })
    after(restore)
    it('should render single template', function (done) {
      render.call({ root: '.' }, 'foo', null, (err, result) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
    it('should render single template with Array-typed root', function (done) {
      render.call({ root: ['.'] }, 'foo', null, (err, result) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
  })
})
