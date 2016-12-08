import ESelect from './ESelect'

import Search from './Search'
import Panel from './Panel'

class Container extends ESelect {
  get Search () { return Search }
  get Panel () { return Panel }

  set option (v) {
    if (Array.isArray(v)) {
      v = { data: v }
    }
    if (!v || !v.data) {
      throw new Error('invalid option', v)
    }
    this._option = v
    this.$search.setData(this._option.data)
  }

  get template () {
    return `
    <div>
      <jkl-search $ref></jkl-search>
      <jkl-panel types="{types}" $ref></jkl-panel>
    </div>
    `
  }

  get styleSheet () {
    return `:scope {
      display: flex;
      color: #666;
      line-height: 26px;
      font-size: 12px;
      text-align: center;
      * {
        box-sizing: border-box;
      }
    }`
  }

  init () {
    this.selected = []

    document.body.addEventListener('click', this.backgroundClick.bind(this))

    this.$subscribe('item-select', this.itemSelect.bind(this))
    this.$subscribe('item-remove', this.itemRemove.bind(this))
    this.$subscribe('type-change', this.typeChange.bind(this))
  }

  ready () {
    this.types = this._option.data.map(({ name }) => { return { name } })
    this.$dispatch('category-change', this.types)
    this.typeChange(this.types[0].name)
  }

  destroy () {
    document.body.removeEventListener(this.backgroundClick)
  }

  backgroundClick () {
    this.$dispatch('background-click')
  }

  itemSelect (item) {
    item.type = this.currentType
    item.selected = true
    item.node.classList.add('selected')
    this.$panel.addTag(item)
    this.selected.push(item)
  }

  itemRemove (item) {
    item.selected = false
    item.node.classList.remove('selected')
    item.tag && item.tag.element.remove()
    delete item.tag
    this.selected = this.selected.filter(s => s.i === item.i && s.level === item.level)
  }

  typeChange (type) {
    this.currentType = type
  }
}

export default Container
