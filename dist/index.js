(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ESelect"] = factory();
	else
		root["ESelect"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jinkela__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jinkela___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jinkela__);
/* 预留，以后可能会扩展原型 */


__WEBPACK_IMPORTED_MODULE_0_jinkela___default.a.register('$ref', function(that, node, ownerElement) {
  Object.defineProperty(ownerElement.component, '$parent', {
    configurable: true,
    enumerable: false,
    get: function() {
      return that
    }
  })

  ownerElement.setAttribute('ref', node.ownerElement.tagName.toLowerCase().replace(/^jkl-(.+)$/, '$$$1'))
});

const prefix = 'ES-'

class ESelect extends __WEBPACK_IMPORTED_MODULE_0_jinkela___default.a {
  constructor (...arg) {
    super(...arg)
    setTimeout(this.ready && this.ready.bind(this), 0)
  }

  get $root () {
    let ref = this
    while(ref['$parent']) {
      ref = ref['$parent']
    }
    return ref
  }

  $dispatch (action, detail) {
    this.$root.element.dispatchEvent(new CustomEvent(prefix + action, { detail }))
  }

  $subscribe (action, callback) {
    this.$root.element.addEventListener(prefix + action, e => { callback(e.detail) })
  }
}

/* harmony default export */ exports["a"] = ESelect;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Search__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Panel__ = __webpack_require__(7);





class Container extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get Search () { return __WEBPACK_IMPORTED_MODULE_1__Search__["a" /* default */] }
  get Panel () { return __WEBPACK_IMPORTED_MODULE_2__Panel__["a" /* default */] }

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
      <jkl-panel types="{types}" $ref></jkl-panel>
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
    this.selected = []

    document.body.addEventListener('click', this.backgroundClick.bind(this))

    this.$subscribe('item-select', this.itemSelect.bind(this))
    this.$subscribe('item-remove', this.itemRemove.bind(this))
    this.$subscribe('type-change', this.typeChange.bind(this))
  }

  ready () {
    this.types = this._option.data.map(({ name }) => { return { name } })
    this.$dispatch('category-change', this.types)
    this.typeChange(this.types[0].name)
  }

  destroy () {
    document.body.removeEventListener(this.backgroundClick)
  }

  backgroundClick () {
    this.$dispatch('background-click')
  }

  itemSelect (item) {
    item.type = this.currentType
    item.selected = true
    item.node.classList.add('selected')
    this.$panel.addTag(item)
    this.selected.push(item)
  }

  itemRemove (item) {
    item.selected = false
    item.node.classList.remove('selected')
    item.tag && item.tag.element.remove()
    delete item.tag
    this.selected = this.selected.filter(s => s.i === item.i && s.level === item.level)
  }

  typeChange (type) {
    this.currentType = type
  }
}

/* harmony default export */ exports["a"] = Container;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

/**/ void function(scope) {
/**/
/**/   // CommonJS
/**/   if (typeof module === 'object' && !!module.exports) return scope(function(name, dependencies, factory) {
/**/     if (typeof name !== 'string') factory = dependencies, dependencies = name, name = null;
/**/     if (!(dependencies instanceof Array)) factory = dependencies, dependencies = [];
/**/     var args;
/**/     args = [  ];
/**/     module.exports = factory.apply(module.exports, args) || module.exports;
/**/   });
/**/
/**/   // AMD, wrap a 'String' to avoid warn of fucking webpack
/**/   if (String("function") === 'function' && !!__webpack_require__(4)) return scope(__webpack_require__(3));
/**/
/**/   // Global
/**/   scope(function(name, dependencies, factory) {
/**/     if (typeof name !== 'string') factory = dependencies, dependencies = name, name = null;
/**/     if (!(dependencies instanceof Array)) factory = dependencies, dependencies = [];
/**/     var exports = {};
/**/     var args = [];
/**/     for (var i = 0; i < dependencies.length; i++) args[i] = window[dependencies[i]];
/**/     exports = factory.apply(exports, args) || exports;
/**/     if (name) {
/**/       /**/ try { /* Fuck IE8- */
/**/       /**/   if (typeof execScript === 'object') execScript('var ' + name);
/**/       /**/ } catch(error) {}
/**/       window[name] = exports;
/**/     }
/**/   });
/**/
/**/ }(function(define) {

define(function() {
/**/ 'use strict';
/**/ void function() { /**/

var STRICT_TAG = { td: 'tr', 'th': 'tr', tr: 'tbody', tbody: 'table', thead: 'table', tfoot: 'table', caption: 'table' };
var NODE_TYPE_NAME = { 2: 'value', 3: 'data' };
var increment = 1;

// Util Definitions
var getShadedProps = function(that, propName, mapping) {
  var list = [];
  for (var i = that; i; i = Object.getPrototypeOf(i)) {
    var desc = Object.getOwnPropertyDescriptor(i, propName);
    if (desc) list.push(desc.get ? desc.get.call(that) : desc.value);
  }
  list.reverse();
  if (typeof mapping === 'function') for (var j = 0; j < list.length; j++) list[j] = mapping(list[j]);
  return list;
};
var define = function(base, name, desc) {
  return Object.defineProperty(base, name, Object.create(desc, { configurable: { value: true } }));
};
var getOnce = function(base, name, getter) {
  define(base, name, { get: function() { return define(this, name, { value: getter.call(this) })[name]; } });
};
var callArray = function(array, that) { for (var i = 0; i < array.length; i++) array[i].call(that); };

// Walk the tree and change "{xxx}" template to accessor properties.
var parseTemplate = function(that) {
  var watches = Object.create(null);
  define(that, '@@watches', { value: watches });
  // Walking and match special templates into "watches"
  void function callee(node, ownerElement) {
    var attrs, sibling, handler, attr, i;
    var child = node.firstChild;
    if (node.nodeType === 1) {
      while (child) {
        sibling = child.nextSibling;
        callee(child);
        child = sibling;
      }
    }
    // Try to match directive
    if (directives.type[node.nodeName]) {
      handler = directives.type[node.nodeName](that, node, ownerElement);
    } else {
      for (i = 0; i < directives.regexp.length; i++) {
        if (directives.regexp[i].regexp.test(node.nodeName)) {
          handler = directives.regexp[i].factory(that, node, ownerElement);
          break;
        }
      }
    }
    // Try to match binding node (textNode or attrNode) and save if matched
    if (/^\{([$_a-zA-Z][$\w]*)\}$/.test(node[NODE_TYPE_NAME[node.nodeType]])) {
      (RegExp.$1 in watches ? watches[RegExp.$1] : watches[RegExp.$1] = []).push(handler || node);
    }
    if (attrs = node.attributes) for (i = 0; attr = attrs[i]; i++) callee(attr, node);
  }(that.element);
  // Change "watches" to accessor properties
  for (var name in watches) void function(name) {
    var list = watches[name];
    var value = that[name];
    var cache;
    define(that, name, {
      enumerable: true,
      get: function() { return cache; },
      set: function(value) {
        cache = value;
        for (var i = 0; i < list.length; i++) {
          if (typeof list[i] === 'function') {
            list[i].call(that, value);
          } else {
            list[i][NODE_TYPE_NAME[list[i].nodeType]] = value;
          }
        }
      }
    });
    that[name] = value;
  }(name);
};

// Extend special fields to instance before parse
var specialFields = [ 'tagName', 'template', 'styleSheet' ];
var extendSpecialFields = function(that, params) {
  for (var key, i = 0; key = specialFields[i]; i++) {
    if (key in params) {
      Object.defineProperty(that, key, { configurable: true, value: params[key] });
      delete params[key];
    }
  }
};

// Main Constructor
var Jinkela = function() {
  var params = {};
  this.extends.apply(params, arguments);
  if (typeof this.beforeParse === 'function') this.beforeParse(params); // Expirimental
  extendSpecialFields(this, params);
  parseTemplate(this);
  // Extends each arguments to this
  if (typeof this.beforeExtends === 'function') this.beforeExtends(); // Expirimental
  this.extends(params);
  // Find all "init" method list in prototype chain and call they
  var args = [ this, arguments ];
  getShadedProps(this, 'init', function(init) { init.apply.apply(init, args); });
};

// Prototype Properties
getOnce(Jinkela.prototype, 'element', function() {
  var target = this.constructor;
  var key = '@@domCache';
  if (!target.hasOwnProperty(key)) {
    var element;
    var template = this.template; // Call once getter handler
    if (template) {
      // Get first tagName from template
      var tagName = String(template.replace(/<!--[\s\S]*?-->/g, '').match(/<([a-z][\w-]*)|$/i)[1]).toLowerCase();
      // Build template
      element = document.createElement(STRICT_TAG[tagName] || 'div');
      element.innerHTML = template;
      if (element.children.length !== 1) throw new Error('Jinkela: Template require 1 root element');
      element = element.firstElementChild;
    } else {
      element = document.createElement(this.tagName || 'div');
    }
    // Find all shaded "styleSheet" from prototype chain and build
    var styleSheetList = getShadedProps(this, 'styleSheet');
    if (styleSheetList.length) {
      var classId = increment++;
      element.setAttribute('jinkela-class', classId);
      var styleSheet = styleSheetList.join('\n').replace(/:scope\b/g, '[jinkela-class="' + classId + '"]');
      if (typeof Jinkela.cssPreprocessor === 'function') styleSheet = Jinkela.cssPreprocessor(styleSheet);
      Jinkela.style.insertAdjacentHTML('beforeend', styleSheet);
    }
    define(target, key, { value: element });
  }
  return target[key].cloneNode(true);
});
getOnce(Jinkela, 'style', function() {
  return document.head.appendChild(document.createElement('style'));
});
getOnce(Jinkela.prototype, '@@didMountHandlers', function() {
  return [ function() { callArray(getShadedProps(this, 'didMount'), this); }.bind(this) ];
});
define(Jinkela.prototype, 'extends', { value: function() {
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (arg instanceof Object) for (var j in arg) this[j] = arg[j];
  }
} });
var createRender = function(name, handler) {
  define(Jinkela.prototype, name, { value: function(target) {
    if (!this.hasOwnProperty('parent')) define(this, 'parent', { value: target });
    if (target instanceof Jinkela) target = target.element;
    handler.call(this, target);
    callArray(this['@@didMountHandlers'], this);
    return this;
  } });
};
createRender('to', function(target) { target.appendChild(this.element); });
createRender('renderTo', function(target) { target.appendChild(this.element); });
createRender('renderWith', function(target) { target.parentNode.replaceChild(this.element, target); });

// Directive register
var directives = { type: Object.create(null), regexp: [] };
Jinkela.register = function(type, factory) {
  if (type instanceof RegExp) {
    directives.regexp.push({ regexp: type, factory: factory });
  } else {
    directives.type[type] = factory;
  }
};

// Export to global
window.Jinkela = Jinkela;

/**/ }(); /**/
Object.defineProperty(Jinkela, 'from', {
  configurable: true,
  value: function(raw) {
    if (raw instanceof Array) {
      var result = [];
      for (var i = 0; i < raw.length; i++) result.push(new this(raw[i]));
      var to = function(target) {
        for (var i = 0; i < raw.length; i++) result[i].to(target);
        return this;
      };
      Object.defineProperty(result, 'renderTo', { configurable: true, value: to });
      Object.defineProperty(result, 'to', { configurable: true, value: to });
      return result;
    } else {
      return new this(raw);
    }
  }
});
Jinkela.cssPreprocessor = function(styleSheet) {
  // Remove comments
  styleSheet = styleSheet.replace(/\/\*[\s\S]*?\*\//g, '');
  // Store special blocks
  var stringStorage = [];
  var atBlockStorage = [];
  styleSheet = styleSheet.replace(/(["'])([\s\S]*?)(\1)/g, function($0) {
    return '<string>' + stringStorage.push($0) + '<\/string>';
  }).replace(/@[^{}]+\{([^{}]+\{[^{}]*\})*\s*\}/g, function($0) {
    return '<atBlock>' + atBlockStorage.push($0) + '<\/atBlock>';
  });
  // Flatten
  var tmp;
  var engin = /(([^{};]+)\{[^{}]*?)([^{};]+)(\{[^{}]*?\})/;
  while (tmp !== styleSheet) {
    styleSheet = (tmp = styleSheet).replace(engin, function($0, $1, $2, $3, $4) {
      var outer = $2.split(/,/g);
      var inner = $3.split(/,/g);
      var mixed = [];
      for (var i = 0; i < outer.length; i++) {
        for (var j = 0; j < inner.length; j++) {
          mixed.push(outer[i] + ' ' + inner[j] + $4);
        }
      }
      return mixed.join('') + $1;
    });
  }
  styleSheet = styleSheet.replace(/\s+&/g, '');
  // Reset special blocks
  styleSheet = styleSheet.replace(/<atBlock>(\d+)<\/atBlock>/g, function($0, $1) {
    return atBlockStorage[$1 - 1];
  }).replace(/<string>(\d+)<\/string>/g, function($0, $1) {
    return stringStorage[$1 - 1];
  });
  return styleSheet;
};
Jinkela.register(/^if(-not)?$/, function(that, node, ownerElement) {
  if (ownerElement.component) ownerElement = ownerElement.component.element;
  var not = !!RegExp.$1;
  var replacement = new Comment(' ' + node.name + '="' + node.value + '" ');
  var state = true;
  var name = /^\{(.*)\}$|$/.exec(node.value)[1];
  that['@@didMountHandlers'].push(function() { this[name] = this[name]; });
  return function(value) {
    value = !!value ^ not;
    if (state === value) return;
    if (value) {
      if (replacement.parentNode) {
        replacement.parentNode.replaceChild(ownerElement, replacement);
        state = value;
      }
    } else {
      if (ownerElement.parentNode) {
        ownerElement.parentNode.replaceChild(replacement, ownerElement);
        state = value;
      }
    }
  };
});
Jinkela.register(/^JKL(?:-[A-Z0-9]+)+$/, function(that, node) {
  // Convert tagName to component name
  var name = node.tagName.slice(4).replace(/(?!^)-?./g, function(str) {
    return str.length > 1 ? str[1] : str.toLowerCase();
  });
  // Get component class
  var Component = that[name] || new Function('return typeof ' + name + ' === \'function\' && ' + name + ';')();
  if (!Component) throw new Error('No component can be matched with ' + node.tagName);
  // Prepare constructing args
  var args = {};
  var attrs = node.attributes;
  var watches = that['@@watches'];
  for (var i = 0; i < attrs.length; i++) {
    var nodeName = attrs[i].nodeName;
    var value = attrs[i].value;
    var matches = /^\{([$_a-zA-Z][$\w]*)\}$/.exec(value);
    if (matches) {
      var propName = matches[1];
      var listeners = propName in watches ? watches[propName] : watches[propName] = [];
      listeners.push(function(nodeName, value) {
        if (component) component[nodeName] = value;
      }.bind(null, nodeName));
      args[nodeName] = that[propName];
    } else {
      args[nodeName] = value;
    }
  }
  // Init component instance
  var component = Component && new Component(args, { children: [].slice.call(node.childNodes, 0) });
  node.component = component;
  component.renderWith(node);
});
Jinkela.register(/^on-/, function(that, node, ownerElement) {
  if (ownerElement.component) ownerElement = ownerElement.component.element;
  var eventName = node.nodeName.match(/^on-(.*)|$/)[1];
  return function(handler) {
    if (typeof handler !== 'function') return;
    ownerElement.addEventListener(eventName, handler.bind(that));
  };
});
Jinkela.register('ref', function(that, node, ownerElement) {
  var fixNode = function(item) {
    if (item == null) item = new Comment(' ' + item + ' '); // eslint-disable-line
    if (item instanceof Jinkela) item = item.element;
    if (!(item instanceof Node)) item = new Text(item);
    return item;
  };
  // var desc = Object.getOwnPropertyDescriptor(that, node.value);
  // TODO: Consider shaded props
  Object.defineProperty(that, node.value, {
    configurable: true,
    enumerable: true,
    get: function() {
      if (ownerElement instanceof DocumentFragment) {
        return ownerElement.originalList;
      } else {
        return ownerElement.component || ownerElement;
      }
    },
    set: function(element) {
      if (element instanceof HTMLCollection || element instanceof NodeList) element = [].slice.call(element);
      if (element instanceof DocumentFragment) element = [].slice.call(element.childNodes);
      if (element instanceof Array) {
        if (element.length) {
          var fragment = new DocumentFragment();
          element.forEach(function(item) { fragment.appendChild(fixNode(item)); });
          fragment.originalList = element;
          element = fragment;
        } else {
          element = new Comment(' empty list ');
        }
      } else {
        element = fixNode(element);
      }
      var parent;
      if (ownerElement instanceof DocumentFragment) {
        var first = ownerElement.originalList[0];
        if (parent = first.parentNode) {
          parent.insertBefore(element, first);
          ownerElement.originalList.forEach(function(item) { item.remove(); });
        }
        ownerElement = element;
      } else if (element !== ownerElement) {
        if (parent = ownerElement.parentNode) {
          parent.insertBefore(element, ownerElement);
          ownerElement.remove();
        }
        ownerElement = element;
      }
    }
  });
});
  return Jinkela;
});

/**/ });


/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 4 */
/***/ function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);


class Tabs extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template () {
    return `<div on-tab-click="{tabClick}"></div>`
  }

  get styleSheet () {
    return `:scope {
      display: flex;
      position: relative;
      top: 1px;
      cursor: default;
      user-select: none;
    }`
  }

  ready () {
    this.$subscribe('category-change', arr => {
      this.innerHTML = ''
      arr[0].selected = true
      this._refs = Tab.from(arr).to(this)
    })

    this.$subscribe('type-change', name => {
      this._refs.forEach(tab => {
        tab.selected = tab.name === name
      })
    })
  }

  tabClick ({ detail }) {
    this.$dispatch('type-change', detail)
  }
}

class Tab extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template () {
    return `<div on-click="{click}">{name}</div>`
  }

  get styleSheet () {
    return `:scope {
      padding: 0 15px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #ddd;
      border-right: none;
      color: #999;
      &:last-child {
        border-right: 1px solid #ddd;
      }
      &.selected, &:hover.selected {
        border-bottom-color: #f8f8f8;
        background: #f8f8f8;
        color: #333;
      }
      &:hover {
        color: #333;
      }
    }`
  }

  set selected (b) {
    this.element.className = b ? 'selected' : ''
  }

  click () {
    if (!this.selected) {
      this.element.dispatchEvent(new CustomEvent('tab-click', {
        bubbles: true,
        detail: this.name
      }))
    }
  }
}

/* harmony default export */ exports["a"] = Tabs;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);


class Tags extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
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

class Tag extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template () {
    return `<li on-click="{click}">{name}</li>`
  }
}

/* harmony default export */ exports["a"] = Tags;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Tabs__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tags__ = __webpack_require__(6);





class Panel extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get Tabs () { return __WEBPACK_IMPORTED_MODULE_1__Tabs__["a" /* default */] }

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

      this._tagsRef = __WEBPACK_IMPORTED_MODULE_2__Tags__["a" /* default */].from(data).to(this.box)
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

/* harmony default export */ exports["a"] = Panel;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);


class Dropdown extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
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

    this.$subscribe('type-change', name => { this.$label.text = name })
  }

  click (e) {
    this.show = !this.show

    if (e.target.tagName === 'LI' && this.text !== e.target.innerText) {
      this.text = e.target.innerText
      this.$dispatch('type-change', this.text)
    } else {
      e.stopPropagation()
    }
  }

  select (name) {
    this.text = name
  }
}

class Label extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template() {
    return `<div>{text}</div>`
  }
}

class List extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
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

class Item extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template () {
    return `
    <li>{name}</li>
    `
  }
}

/* harmony default export */ exports["a"] = Dropdown;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);


class Input extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
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

/* harmony default export */ exports["a"] = Input;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);


const PAGE_SIZE = 50

class Select extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get tagName () { return 'ul' }

  init () {
    Object.keys(this.position).forEach(attr => {
      this.element.style[attr] = this.position[attr] + 'px'
    })

    this.render()
  }

  enableLazyRender () {
    this.lazy = { index: 0 }
    this.lazy.max = Math.ceil(this.data.length / PAGE_SIZE)

    this.element.addEventListener('scroll', this.scroll.bind(this))
  }

  disableLazyRender () {
    this.lazy = null
    this.element.removeEventListener('scroll', this.scroll)
  }

  scroll () {
    const { element, lazy } = this

    if (!lazy.scrollHeight || !lazy.offsetHeight) {
      lazy.scrollHeight = element.scrollHeight
      lazy.offsetHeight = element.offsetHeight
    }
    // TODO: throttle
    if (element.scrollTop + lazy.offsetHeight * 2 > lazy.scrollHeight) {
      this.nextPage()
    }
  }

  getPageData (index) {
    return this.data.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE)
  }

  nextPage () {
    if (this.lazy.index < this.lazy.max - 1) {
      this.renderData(this.getPageData(++this.lazy.index))
      // recalculate scrollHeight
      setTimeout(() => { this.lazy.scrollHeight = this.element.scrollHeight }, 0)
    }
  }

  render (data) {
    if (data) { this.data = data }

    if (this.data.length > PAGE_SIZE && !this.lazy) {
      this.enableLazyRender()
    }

    if (this.data.length < PAGE_SIZE && this.lazy) {
      this.disableLazyRender()
    }

    this.element.innerHTML = ''
    if (this.lazy) {
      this.renderData(this.getPageData(0))
    } else {
      this.renderData(this.data)
    }
  }

  renderData (data) {
    data.forEach(d => {
      let node = new Item({ title: d.title, name: d.n, selected: d.selected }).to(this)

      node.element.addEventListener('click', e => {
        e.stopPropagation()
        d.node = node.element
        this.$dispatch(
          d.selected ? 'item-remove' : 'item-select',
          d
        )
      })

      node.element.addEventListener('mouseenter', e => {
        d.index = this.index
        this.$parent.$parent.itemHover({ target: node.element, detail: d })
      })
    })
  }
}

class Item extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get template () {
    return `
    <li>
      <span>{title}</span><strong>{name}</strong>
    </li>`
  }

  init () {
    if (this.selected) {
      this.element.classList.add('selected')
    }
  }
}

/* harmony default export */ exports["a"] = Select;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Select__ = __webpack_require__(10);



class Selects extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
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
        z-index: 999;
        background: #fff;
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
    this._refs[index] = new __WEBPACK_IMPORTED_MODULE_1__Select__["a" /* default */]({ index, data, position, $parent: this }).to(this)
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

/* harmony default export */ exports["a"] = Selects;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ESelect__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Dropdown__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Input__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Selects__ = __webpack_require__(11);






class Search extends __WEBPACK_IMPORTED_MODULE_0__ESelect__["a" /* default */] {
  get Dropdown () { return __WEBPACK_IMPORTED_MODULE_1__Dropdown__["a" /* default */] }
  get Input () { return __WEBPACK_IMPORTED_MODULE_2__Input__["a" /* default */] }

  get template () {
    return `
    <div on-input="{search}">
      <jkl-dropdown $ref></jkl-dropdown>
      <jkl-input $ref on-click="{inputClick}"></jkl-input>
    </div>
    `
  }

  get styleSheet () {
    return `:scope {
      width: 300px;
      height: 26px;
      display: flex;
      border: 1px solid #ddd;
    }`
  }

  get currentType () { return this.$parent.currentType }
  set currentType (name) { this.$parent.currentType = name }

  get model () { return this._model[this.currentType] }
  set model (v) { this._model[this.currentType] = v }

  get flat () { return this._flat[this.currentType] }
  set flat (v) { this._flat[this.currentType] = v }

  setData (data) {
    // TODO: init $selects status
    this._model = {}
    this._flat = {}

    data.forEach(d => {
      this._model[d.name] = d
      const flat = []
      d.struct.forEach((title, index) => {
        for (let id in d.data[index]) {
          d.data[index][id].forEach(item => {
            item.title = title
            item.level = index
            flat.push(item)
          })
        }
      })
      this._flat[d.name] = flat
    })
  }

  inputClick (e) {
    e.stopPropagation()
    if (!this.$selects) {
      this.$selects = new __WEBPACK_IMPORTED_MODULE_3__Selects__["a" /* default */]({ $parent: this }).to(document.body)
    }

    const { top, left, height } = this.$input.element.getBoundingClientRect()
    const position = {
      top: top + height + window.pageYOffset,
      left: left + window.pageXOffset
    }

    this.$selects.show({ position, index: 0, data: this.flat })
  }

  itemHover ({ target, detail }) {
    if (detail.level >= this.model.struct.length - 1) {
      if (detail.index === 0) { this.$selects.removeBy(1) }
      return
    }

    const data = this.model.data[detail.level + 1][detail.i]
    if (!data || !data.length) { return }

    const { top, left, width } = target.getBoundingClientRect()
    this.$selects.show({
      data,
      index: detail.index + 1,
      position: {
        top: top + window.pageYOffset,
        left: left + width + window.pageXOffset
      }
    })
  }

  search ({ target }) {
    // TODO: debounce
    const data = this.flat.filter(d => d.n.indexOf(target.value) >= 0)
    this.$selects.set(0, data)
  }
}

/* harmony default export */ exports["a"] = Search;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Container__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "init", function() { return init; });


function init (element, option) {
  return new __WEBPACK_IMPORTED_MODULE_0__Container__["a" /* default */]({ option }).renderTo(element)
}




/***/ }
/******/ ]);
});