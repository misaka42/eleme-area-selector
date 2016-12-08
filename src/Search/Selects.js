import ESelect from '../ESelect'
import Select from './Select'

class Selects extends ESelect {
  get tagName () { return 'div' }

  get styleSheet () {
    return `:scope {
      cursor: default;
      user-select: none;
      * {
        box-sizing: border-box;
      }
      > ul {
        position: absolute;
        list-style: none;
        line-height: 26px;
        text-align: center;
        border: 1px solid #ddd;
        border-top: none;
        max-height: 390px;
        overflow: auto;
        margin: 0;
        padding: 0;
        font-size: 12px;
        color: #666;
      }
      li {
        display: flex;
        height: 26px;
        border-top: 1px solid #ddd;
        transition: background .1s;
        &:hover {
          background: #f1f1f1;
        }
        &.selected {
          color: #19d4ae;
        }
      }
      span {
        padding: 0 10px;
        background: #f8f8f8;
        color: #aaa;
        border-right: 1px solid #ddd;
      }
      strong {
        flex: 1;
        padding: 0 15px;
      }
    }`
  }

  init () {
    this._refs = []

    this.$subscribe('background-click', () => {
      this.removeBy(0)
    })

    this.element.addEventListener('item-click', e => {
      e.detail.node = e.target
      const action = e.target.classList.contains('selected') ? 'item-remove' : 'item-select'
      this.$dispatch(action, e.detail)
    })
  }

  set (index, data) {
    this.removeBy(index + 1)
    this._refs[index].render(data)
  }

  show ({ index, data, position }) {
    this.removeBy(index)
    this._refs[index] = new Select({ index, data, position, $parent: this }).to(this)
  }

  remove (index) {
    if (this._refs[index]) {
      this.element.removeChild(this._refs[index].element)
      this._refs[index] = null
    }
  }

  removeBy (index) {
    for (let i = index; i < this._refs.length; i++) {
      this.remove(i)
    }
  }
}

export default Selects
