/* 预留，以后可能会扩展原型 */
import Jinkela from 'jinkela'

Jinkela.register('$ref', function(that, node, ownerElement) {
  Object.defineProperty(ownerElement.component, '$parent', {
    configurable: true,
    enumerable: false,
    get: function() {
      return that
    }
  })

  ownerElement.setAttribute('ref', node.ownerElement.tagName.toLowerCase().replace(/^jkl-(.+)$/, '$$$1'))
});

const prefix = 'ES-'

class ESelect extends Jinkela {
  constructor (...arg) {
    super(...arg)
    setTimeout(this.ready && this.ready.bind(this), 0)
  }

  get $root () {
    let ref = this
    while(ref['$parent']) {
      ref = ref['$parent']
    }
    return ref
  }

  $dispatch (action, detail) {
    this.$root.element.dispatchEvent(new CustomEvent(prefix + action, { detail }))
  }

  $subscribe (action, callback) {
    this.$root.element.addEventListener(prefix + action, e => { callback(e.detail) })
  }
}

export default ESelect
