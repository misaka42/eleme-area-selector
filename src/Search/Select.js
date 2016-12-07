import ESelect from '../ESelect'

const PAGE_SIZE = 50

class Select extends ESelect {
  get tagName () { return 'ul' }

  init () {
    Object.keys(this.position).forEach(attr => {
      this.element.style[attr] = this.position[attr] + 'px'
    })

    this.element.addEventListener('item-hover', e => {
      e.detail.index = this.index
      this.$parent.$parent.itemHover(e)
    })

    this.render()
  }

  enableLazyRender () {
    this.lazy = { index: 0 }
    this.lazy.max = Math.ceil(this.data.length / PAGE_SIZE)

    this.element.addEventListener('scroll', this.scroll.bind(this))
  }

  disableLazyRender () {
    this.lazy = null
    this.element.removeEventListener('scroll', this.scroll)
  }

  scroll () {
    const { element, lazy } = this

    if (!lazy.scrollHeight || !lazy.offsetHeight) {
      lazy.scrollHeight = element.scrollHeight
      lazy.offsetHeight = element.offsetHeight
    }
    // TODO: throttle
    if (element.scrollTop + lazy.offsetHeight * 2 > lazy.scrollHeight) {
      this.nextPage()
    }
  }

  getPageData (index) {
    return this.data.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE)
  }

  nextPage () {
    if (this.lazy.index < this.lazy.max - 1) {
      Item.from(this.getPageData(++this.lazy.index)).to(this)
      // recalculate scrollHeight
      setTimeout(() => { this.lazy.scrollHeight = this.element.scrollHeight }, 0)
    }
  }

  render (data) {
    if (data) { this.data = data }

    if (this.data.length > PAGE_SIZE && !this.lazy) {
      this.enableLazyRender()
    }

    if (this.data.length < PAGE_SIZE && this.lazy) {
      this.disableLazyRender()
    }

    this.element.innerHTML = ''
    if (this.lazy) {
      Item.from(this.getPageData(0)).to(this)
    } else {
      Item.from(this.data).to(this)
    }
  }
}

class Item extends ESelect {
  get template () {
    return `
    <li on-click="{click}" on-mouseenter="{mouseenter}">
      <span>{title}</span><strong>{n}</strong>
    </li>`
  }

  click (e) {
    e.stopPropagation()
    this._dispatch('item-select')
  }

  mouseenter () {
    this._dispatch('item-hover')
  }

  _dispatch (action) {
    this.element.dispatchEvent(new CustomEvent(action, {
      bubbles: true,
      detail: {
        name: this.n,
        id: this.i,
        level: this.level,
        title: this.title
      }
    }))
  }
}

export default Select
