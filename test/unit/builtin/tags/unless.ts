import Liquid from 'src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/unless', function () {
  let liquid
  before(() => { liquid = new Liquid() })

  it('should render else when predicate yields true', async function () {
    // 0 is truthy
    const src = '{% unless 0 %}yes{%else%}no{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('no')
  })
  it('should render unless when predicate yields false', async function () {
    const src = '{% unless false %}yes{%else%}no{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('yes')
  })
  it('should reject when tag not closed', function () {
    const src = '{% unless 1>2 %}yes'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/tag {% unless 1>2 %} not closed/)
  })
  it('should render unless when predicate yields false and else undefined', async function () {
    const src = '{% unless 1>2 %}yes{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('yes')
  })
  it('should render "" when predicate yields false and else undefined', async function () {
    const src = '{% unless 1<2 %}yes{%endunless%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
})
