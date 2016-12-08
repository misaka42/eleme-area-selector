import ESelect from '../ESelect'

import Tabs from './Tabs'
import Tags from './Tags'

class Panel extends ESelect {
  get Tabs () { return Tabs }

  get template () {
    return `
    <div>
      <jkl-tabs $ref></jkl-tabs>
      <section ref="box"></section>
    </div>`
  }

  get styleSheet () {
    return `:scope {
      flex: 1;
      margin-left: 15px;
      max-width: 600px;
      > section {
        border: 1px solid #ddd;
        background: #f8f8f8;
      }
    }`
  }

  ready () {
    this.$subscribe('type-change', type => {
      this.currentType = type
      this._tagsRef.forEach(tags => {
        tags.element.style.display = tags.type.name === type ? 'block' : 'none'
      })
    })

    this.$subscribe('category-change', arr => {
      this.currentType = arr[0].name
      const data = arr.map(d => {
        return {
          type: d,
          $parent: this
        }
      })

      this._tagsRef = Tags.from(data).to(this.box)
    })
  }

  addTag (data) {
    this._tagsRef.forEach(tags => {
      if (tags.type.name === this.currentType) {
        tags.add(data)
      }
    })
  }
}

export default Panel
