import ESelect from '../ESelect'

class Tags extends ESelect {
  get Tag () { return Tag }
  get tagName () { return 'ul' }

  get styleSheet () {
    return `:scope {
      list-style: none;
      margin: 0;
      padding: 3px 0 0 0;
      line-height: 18px;
      text-align: left;
      min-height: 24px;
      > li {
        display: inline-block;
        margin: 0 0 3px 3px;
        padding: 0 8px;
        cursor: pointer;
        height: 18px;
        border-radius: 2px;
        background: #19d4ae;
        color: #fff;
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
