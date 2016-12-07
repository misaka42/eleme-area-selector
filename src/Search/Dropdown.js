import ESelect from '../ESelect'

class Dropdown extends ESelect {
  get List () { return List }
  get Label () { return Label }

  get template () {
    return `
    <div on-click="{click}">
      <jkl-label $ref text="{text}"></jkl-label>
      <jkl-list $ref data="{data}" show="{show}"></jkl-list>
    </div>
    `
  }

  get styleSheet () {
    return `:scope {
      position: relative;
      border-right: 1px solid #ddd;
      cursor: default;
      user-select: none;
      > div {
        padding: 0 10px;
        min-width: 100px;
        height: 24px;
        background: #f8f8f8;
        transition: background .1s;
        &:hover {
          background: #eee;
        }
        &:active {
          background: #ddd;
        }
        &::after {
          content: '▼'
        }
      }
      > ul {
        position: absolute;
        width: 100%;
        top: 24px;
        left: -1px;
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #ddd;
        border-top: none;
        box-sizing: content-box;
      }
      li {
        height: 26px;
        border-top: 1px solid #ddd;
        &:hover {
          background: #eee;
        }
      }
    }`
  }

  ready () {
    this.$subscribe('category-change', data => {
      this.data = data
      this.text = data[0].name
    })

    this.$subscribe('background-click', data => {
      this.show = false
    })
  }

  click (e) {
    this.show = !this.show

    if (e.target.tagName === 'LI' && this.text !== e.target.innerText) {
      this.text = e.target.innerText
      this.$dispatch('category-select', this.text)
    } else {
      e.stopPropagation()
    }
  }

  select (name) {
    this.text = name
  }
}

class Label extends ESelect {
  get template() {
    return `<div>{text}</div>`
  }
}

class List extends ESelect {
  get tagName () { return 'ul' }

  set data (data) {
    if (Array.isArray(data)) {
      Item.from(data).to(this)
    }
  }

  set show (show) {
    this.element.style.display = show ? 'block' : 'none'
  }
}

class Item extends ESelect {
  get template () {
    return `
    <li>{name}</li>
    `
  }
}

export default Dropdown
