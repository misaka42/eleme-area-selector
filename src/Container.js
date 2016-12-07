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
      <jkl-panel $ref></jkl-panel>
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
    this.model = []

    document.body.addEventListener('click', this.backgroundClick.bind(this))
    this.$subscribe('item-select', this.itemSelect.bind(this))
  }

  ready () {
    const category = this._option.data.map(({ name }) => { return { name } })
    this.$dispatch('category-change', category)
  }

  destroy () {
    document.body.removeEventListener(this.backgroundClick)
  }

  backgroundClick () {
    this.$dispatch('background-click')
  }

  itemSelect (data) {
    this.model.push(data)
  }
}

export default Container
