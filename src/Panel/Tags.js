import ESelect from '../ESelect'

class Tags extends ESelect {
  get Tag () { return Tag }
  get tagName () { return 'ul' }

  get styleSheet () {
    return `:scope {
      list-style: none;
      margin: 0;
      padding: 0;
      line-height: 20px;
      text-align: left;
      > li {
        display: inline-block;
        margin: 3px 0 0 3px;
        padding: 0 5px;
        border: 1px solid #ddd;
        cursor: pointer;
      }
    }`
  }

  add (data) {
    data.tag = new Tag({ name: data.n }).to(this)
    data.tag.element.addEventListener('click', () => {
      this.$dispatch('item-remove', data)
    })
  }
}

class Tag extends ESelect {
  get template () {
    return `<li on-click="{click}">{name}</li>`
  }
}

export default Tags
