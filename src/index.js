import Container from './Container'

function init (element, option) {
  return new Container({ option }).renderTo(element)
}

export { init }
