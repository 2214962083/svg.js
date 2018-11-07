import { adopt } from '../../utils/adopter.js'
import { map } from '../../utils/utils.js'
import { registerMethods } from '../../utils/methods.js'

export default function baseFind (query, parent) {
  return map((parent || document).querySelectorAll(query), function (node) {
    return adopt(node)
  })
}

// Scoped find method
export function find (query) {
  return baseFind(query, this.node)
}

registerMethods('Dom', { find })
