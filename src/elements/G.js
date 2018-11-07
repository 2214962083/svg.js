import { nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class G extends Container {
  constructor (node) {
    super(nodeOrNew('g', node), G)
  }
}

registerMethods({
  Element: {
    // Create a group element
    group: function () {
      return this.put(new G())
    }
  }
})

register(G)
