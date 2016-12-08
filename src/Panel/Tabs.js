import ESelect from '../ESelect'

class Tabs extends ESelect {
  get template () {
    return `<div on-tab-click="{tabClick}"></div>`
  }

  get styleSheet () {
    return `:scope {
      display: flex;
      border-bottom: 1px solid #ddd;
      cursor: default;
      user-select: none;
    }`
  }

  ready () {
    this.$subscribe('category-change', arr => {
      this.innerHTML = ''
      arr[0].selected = true
      this._refs = Tab.from(arr).to(this)
    })

    this.$subscribe('type-change', name => {
      this._refs.forEach(tab => {
        tab.selected = tab.name === name
      })
    })
  }

  tabClick ({ detail }) {
    this.$dispatch('type-change', detail)
  }
}

class Tab extends ESelect {
  get template () {
    return `<div on-click="{click}">{name}</div>`
  }

  get styleSheet () {
    return `:scope {
      padding: 0 15px;
      border-right: 1px solid #ddd;
      &.selected, &:hover.selected {
        color: #fff;
        background: #19d4ae;
        border-color: #19d4ae;
      }
      &:hover {
        color: #19d4ae;
      }
    }`
  }

  set selected (b) {
    this.element.className = b ? 'selected' : ''
  }

  click () {
    if (!this.selected) {
      this.element.dispatchEvent(new CustomEvent('tab-click', {
        bubbles: true,
        detail: this.name
      }))
    }
  }
}

export default Tabs
