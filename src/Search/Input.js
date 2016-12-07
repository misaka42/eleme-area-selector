import ESelect from '../ESelect'

class Input extends ESelect {
  get template () {
    return `<input type="search" />`
  }

  get styleSheet () {
    return `:scope {
      outline: none;
      border: none;
      margin: 0;
      padding: 0 10px;
      flex: 1;
    }`
  }
}

export default Input
