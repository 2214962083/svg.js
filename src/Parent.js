/* global createElement */

SVG.Parent = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node)
  },

  // Inherit from
  inherit: SVG.Element,

  // Add class methods
  extend: {
    // Returns all child elements
    children: function () {
      return SVG.utils.map(this.node.children, function (node) {
        return SVG.adopt(node)
      })
    },
    // Add given element at a position
    add: function (element, i) {
      element = createElement(element)

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null)
      }

      return this
    },
    // Basically does the same as `add()` but returns the added element instead
    put: function (element, i) {
      this.add(element, i)
      return element.instance || element
    },
    // Checks if the given element is a child
    has: function (element) {
      return this.index(element) >= 0
    },
    // Gets index of given element
    index: function (element) {
      return [].slice.call(this.node.children).indexOf(element.node)
    },
    // Get a element at the given index
    get: function (i) {
      return SVG.adopt(this.node.children[i])
    },
    // Get first child
    first: function () {
      return this.get(0)
    },
    // Get the last child
    last: function () {
      return this.get(this.node.children.length - 1)
    },
    // Iterates over all children and invokes a given block
    each: function (block, deep) {
      var children = this.children()
      var i, il

      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element) {
          block.apply(children[i], [i, children])
        }

        if (deep && (children[i] instanceof SVG.Parent)) {
          children[i].each(block, deep)
        }
      }

      return this
    },
    // Remove a given child
    removeElement: function (element) {
      this.node.removeChild(element.node)

      return this
    },
    // Remove all elements in this container
    clear: function () {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild)
      }

      // remove defs reference
      delete this._defs

      return this
    }
  }

})
