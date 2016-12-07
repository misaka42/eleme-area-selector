import ESelect from '../ESelect'

class Tags extends ESelect {
  get Tag () { return Tag }
  get tagName () { return 'ul' }

  get styleSheet () {
    return `:scope {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      line-height: 20px;
      > li {
        margin: 3px;
        padding: 0 10px;
        border: 1px solid #ddd;
      }
    }`
  }

  clear () {}

  batch (arr) {
    Tag.from(arr).to(this)
  }

  add (data) {
    data.tag = new Tag(data).to(this)
  }
}

class Tag extends ESelect {
  get template () {
    return `<li>{name}</li>`
  }
}

export default Tags
