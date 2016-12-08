import ESelect from '../ESelect'

const PAGE_SIZE = 50

class Select extends ESelect {
  get tagName () { return 'ul' }

  init () {
    Object.keys(this.position).forEach(attr => {
      this.element.style[attr] = this.position[attr] + 'px'
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
      this.renderData(this.getPageData(++this.lazy.index))
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
      this.renderData(this.getPageData(0))
    } else {
      this.renderData(this.data)
    }
  }

  renderData (data) {
    data.forEach(d => {
      let node = new Item({ title: d.title, name: d.n, selected: d.selected }).to(this)

      node.element.addEventListener('click', e => {
        e.stopPropagation()
        d.node = node.element
        this.$dispatch(
          d.selected ? 'item-remove' : 'item-select',
          d
        )
      })

      node.element.addEventListener('mouseenter', e => {
        d.index = this.index
        this.$parent.$parent.itemHover({ target: node.element, detail: d })
      })
    })
  }
}

class Item extends ESelect {
  get template () {
    return `
    <li>
      <span>{title}</span><strong>{name}</strong>
    </li>`
  }

  init () {
    if (this.selected) {
      this.element.classList.add('selected')
    }
  }
}

export default Select
