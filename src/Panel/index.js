import ESelect from '../ESelect'

import Tabs from './Tabs'
import Tags from './Tags'

class Panel extends ESelect {
  get Tabs () { return Tabs }
  get Tags () { return Tags }

  get template () {
    return `
    <div>
      <jkl-tabs $ref></jkl-tabs>
      <jkl-tags $ref></jkl-tags>
    </div>`
  }

  get styleSheet () {
    return `:scope {
      border: 1px solid #ddd;
      flex: 1;
      margin-left: 15px;
    }`
  }

  ready () {
    this.$subscribe('item-select', this.addTag.bind(this))
  }

  initTags (arr) {
    this.$tags.batch(arr)
  }

  addTag (data) {
    this.$tags.add(data)
  }
}

export default Panel
