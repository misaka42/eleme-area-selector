/*
* @name eleme-area-selector
* @author peiqiao.peng@ele.me
*/

;(function(){

  var __CACHE__ = {};

  var DEFAULT_CONFIG = {
    origin: '/api/other/filter/', // api url
    styleCDN: '//npm.elemecdn.com/eleme-area-selector@0.1.7/dist/style.css', // style from CDN
    typeMap: {
      '交易平台BU': { id: 'bu', params: { time: 'hour' } },
      '红包': { id: 'redReward' },
      'BOD': { id: 'bod' },
      '高校': { id: 'business/gx' },
      '白领': { id: 'business/bl' },
      '早餐': { id: 'breakfast' },
      '城市补贴与优惠': { id: 'cityAllowance' },
      '城市': { id: 'cityAllowance' }
    },
    onReady: null,
    onChange: null,
    onTypeChange: null,
    types: ['交易平台BU'] // default display types
  };

  function AreaSelector(el, config) {
    this.el = el;
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.init();
  }

  AreaSelector.prototype = {
    init: function() {
      this.el.innerHTML = 'Loading Style...';
      var _this = this;
      this.__configStyle(function() {
        _this.setCurrentType(_this.config.types[0]);
      });
    },

    __configStyle: function(callback) {
      if (!document.querySelector('[data-id=EAS-Style]')) {
        var style = __createElement('link', { rel: 'stylesheet', href: this.config.styleCDN }, { id: 'EAS-Style' });
        style.onload = callback;
        document.head.appendChild(style);
      } else {
        callback();
      }
    },

    setCurrentType: function(type) {
      this.currentType = type;
      this.refresh();
      if (this.config.onTypeChange) { this.config.onTypeChange(type) }
    },

    refresh: function() {
      this.el.innerHTML = 'Loading Data...';
      this.model = [];
      this.data = {};
      this.keyword = '';
      this.selects = {};

      // is rebuild ?
      if (!__isEmpty(this.refs)) {
        this.__rebuild = true;
        __remove(this.refs.container);
        __remove(this.refs.selectContainer);
      }
      this.refs = {};

      if (__CACHE__[this.currentType]) {
        this.__build(__CACHE__[this.currentType]);
      } else {
        __fetchData({
          url: this.config.origin + this.config.typeMap[this.currentType].id,
          params: this.config.typeMap[this.currentType].params
        }, this.__build.bind(this));
      }
    },

    __build: function(data) {
      this.data = data;
      __CACHE__[this.currentType] = data;

      var refs = this.refs;
      var _this = this;

      // create basic element
      refs.container = __createElement('div', { className: 'eas-container' });
      refs.inputContainer = __createElement('div', { className: 'input-container' });
      refs.typeBox = __createElement('div', { className: 'type-box' });
      refs.type = __createElement('div', { className: 'current-type' });
      refs.typeList = __createElement('ul', { className: 'type-list' });
      refs.input = __createElement('input', { className: 'eas-input', type: 'search' });

      refs.resultContainer = __createElement('div', { className: 'result-container' });
      refs.clearAll = __createElement('div', { className: 'clear-all', innerHTML: '清除全部' });
      refs.tags = __createElement('div', { className: 'eas-tags' });

      refs.selectContainer = __createElement('div', { className: 'eas-selects' });

      // build
      this.el.innerHTML = '';
      __append(refs.container, refs.inputContainer, refs.resultContainer);
      __append(refs.typeBox, refs.type, refs.typeList);
      __append(refs.inputContainer, refs.typeBox, refs.input)
      __append(refs.resultContainer, refs.tags, refs.clearAll);

      this.refs.type.innerHTML = this.currentType;
      this.__buildTypeList();

      // event handler
      if (!this.rebuild) {
        document.body.addEventListener('click', function() {
          _this.hideSelect(0);
        });
      }

      this.refs.input.addEventListener('click', function(e) {
        _this.showSelect();
        e.stopPropagation();
      });

      this.refs.input.addEventListener('input', function(e) {
        _this.search();
      });

      this.refs.clearAll.addEventListener('click', function() {
        _this.clearAll();
      });

      __delegate(this.refs.typeList, 'type-list-item', 'click', function(target) {
        _this.setCurrentType(target.textContent)
      }, true);

      __delegate(this.refs.selectContainer, 'eas-select-item', 'mousemove', function(target) {
        if (target === this.__lastMouseMoveTarget) { return; }
        this.__lastMouseMoveTarget = target;

        [].slice.call(target.parentNode.children).forEach(function(child) {
          if (child.classList.contains('hover')) {
            child.classList.remove('hover');
          }
        });
        target.classList.add('hover');

        var level = target.parentNode.dataset.level;
        var targetData = _this.selects[level].data[__getIndex(target)];
        _this.showSelect(_this.selects[level], targetData);
      });

      __delegate(this.refs.selectContainer, 'eas-select-item', 'click', function(target) {
        _this.__selectItem(_this.selects[target.parentNode.dataset.level].display[__getIndex(target)]);
        target.classList.add('selected');
      }, true);

      __delegate(this.refs.tags, 'eas-tag', 'click', function(target) {
        _this.__removeItem(__getIndex(target));
      });

      // append to page
      __append(document.body, refs.selectContainer);
      __append(this.el, refs.container);

      // build main select
      this.__buildMainSelelt();

      // set default select item
      this.data[0][0].forEach(function(item) {
        _this.__selectItem(item);
      });

      this.__rebuild = false;

      if (this.config.onReady) { this.config.onReady() }
    },

    __buildTypeList: function() {
      var _this = this;
      if (this.config.types.length > 1) {
        __forEach(this.config.types, function(item) {
          __append(_this.refs.typeList, __createElement('li', { className: 'type-list-item', innerHTML: item }));
        });
      }
    },

    __buildMainSelelt: function() {
      // put all tree items into one Array
      var level = 0;
      var all = [];
      while (this.data[level]) {
        __forEach(this.data[level], function(node) {
          __forEach(node, function(item) {
            item.level = level;
            all.push(item);
          })
        })
        level++;
      }
      this.data.all = all;

      // calculate select position top
      var rect = this.refs.input.getBoundingClientRect();
      this.__selectTop = rect.top + rect.height;

      var el = this.__generateSelect(0);
      el.style.left = rect.left - 1 + 'px';
      el.style.top = this.__selectTop + 'px';
      el.style.display = 'none';

      __append(this.refs.selectContainer, el);
    },

    showSelect: function(previousSelect, parentData) {
      if (!previousSelect) {
        this.refreshMainSelect();
        this.selects[0].el.style.display = 'block';
        this.hideSelect(1);
      } else {
        this.hideSelect(previousSelect.level + 1);
        if (parentData.level >= this.data.struct.length - 1) {
          return;
        }

        var el = this.__generateSelect(parentData.level + 1, parentData.i);
        var rect = previousSelect.el.getBoundingClientRect();
        el.style.top = this.__selectTop + 'px';
        el.style.left = rect.left + rect.width - 1 + 'px';
        __append(this.refs.selectContainer, el);
      }
    },

    hideSelect: function(level) {
      if (level === 0) {
        this.selects[0].el.style.display = 'none';
        level++;
      }
      for (; level < this.data.struct.length; level++) {
        if (this.selects[level]) {
          __remove(this.selects[level].el);
          this.selects[level] = null;
        }
      }
    },

    refreshMainSelect: function() {
      var _this = this;
      var data = this.data.all;
      if (this.keyword) {
        data = this.data.all.filter(function(item) {
          return item.n.toUpperCase().indexOf(_this.keyword.toUpperCase()) > -1;
        });
      }
      this.__generateSelect(0, 0, data);
    },

    __generateSelect: function(level, parentId, presetData) {
      if (!this.data[level]) { return; }
      if (level === 0) { parentId = 0; }

      var el = __createElement('ul', { className: 'eas-select' }, { level: level });
      var data = this.data[level][parentId];
      if (level === 0) {
        data = this.data.all;
      }
      if (presetData) {
        data = presetData;
      }

      var model = { el: el, data: data, level: level };
      var collections = new DocumentFragment();
      var _this = this;
      model.display = data;

      if (data.length > 200) {
        model.display = data.slice(0, 200);

        el.addEventListener('scroll', function() {
          if (this.scrollTop / 27 + 20 > model.display.length) {
            var additons = new DocumentFragment();
            model.data.slice(model.display.length - 1, model.display.length + 200).forEach(function(item) {
              __append(additons, _this.__generateSelectItem(item));
            })
            __append(this, additons);
            model.display = model.data.slice(0, model.display.length + 200);
          }
        })
      }

      model.display.forEach(function(item) {
        __append(collections, _this.__generateSelectItem(item));
      });

      __append(el, collections);

      if (this.selects[level] && this.selects[level].el) {
        Object.assign(el.style, this.selects[level].el.style);
        this.refs.selectContainer.replaceChild(el, this.selects[level].el);
      }
      this.selects[level] = model;
      return el;
    },

    __generateSelectItem: function(data) {
      var className = 'eas-select-item';
      if (this.model.some(function(item) {
        return item.i === data.i && item.level === data.level;
      })) {
        className += ' selected';
      }
      var el = __createElement('li', { className: className });
      el.innerHTML = '<small>' + data.level + '</small><i>' + this.data.struct[data.level] + '</i><span>' + data.n + '</span>';
      return el;
    },

    setCurrentLevel: function(level) {
      if (level > 0 && level < this.data.struct.length) {
        this.currentLevel = level;
      } else {
        this.currentLevel = 0;
      }
    },

    __selectItem: function(item) {
      if (!this.model.some(function(i) { return i.i === item.i && i.level === item.level; })) {
        this.model.unshift(item);
        this.setCurrentLevel(item.level);
        this.refreshModel();
      }
    },

    __removeItem: function(index) {
      this.model.splice(index, 1);
      var level = this.currentLevel;

      if (this.model.length === 0) {
        this.setCurrentLevel(0);
      } else {
        if (!this.model.some(function(item) { return item.level === level })) {
          this.setCurrentLevel(Math.max.apply(null, this.model.map(function(item) { return item.level })));
        }
      }
      this.refreshModel();
    },

    clearAll: function() {
      this.model = [];
      this.refreshModel();
    },

    getModel: function() {
      if (!this.model.length) {
        return { level: '', data: '' };
      }
      var model = {};
      var level = this.currentLevel;
      model.level = level + 1;
      model.data = this.model.filter(function(item) { return item.level === level }).map(function(item) { return item.i }).join(',');
      return model;
    },

    refreshModel: function() {
      var level = this.currentLevel;
      this.refs.tags.innerHTML = this.model.map(function(item) {
        var className = 'eas-tag';
        if (item.level !== level) {
          className += ' disabled';
        }
        return '<li class="' + className + '"><span>' + item.n + '</span><i></i></li>';
      }).join('');

      if (this.config.onChange) { this.config.onChange() }
    },

    search: function() {
      this.keyword = this.refs.input.value.trim();
      this.showSelect();
    }
  }


  /* ---- utils ---- */
  function __append() {
    var args = Array.prototype.slice.call(arguments);
    var parent = args.shift();
    args.forEach(function(child) {
      parent.appendChild(child);
    })
  }

  function __remove(el) {
    if (typeof el.remove === 'function') {
      el.remove();
    } else {
      el.parentNode.removeChild(el);
    }
  }

  function __isEmpty(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

  function __getIndex(node) {
    return [].indexOf.call(node.parentNode.children, node);
  }

  function __createElement(tagName, params, attrs) {
    var el = document.createElement(tagName);
    if (params) {
      Object.assign(el, params);
    }
    if (attrs) {
      Object.assign(el.dataset, attrs);
    }
    return el;
  }

  function __convertParamsToString(params) {
    if (!params) {
      return '';
    }
    return '?' + Object.keys(params).map(function(key) {
      return key + '=' + params[key];
    }).join('&');
  }

  function __fetchData(config, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText) {
          var json = JSON.parse(xhr.responseText);
          if (json.code === 200 && json.data) {
            callback(json.data);
          } else {
            console.error(json);
          }
        }
      } else {
        if (xhr.status && xhr.status !== 200) {
          throw new Error(xhr.responseText);
        }
      }
    }

    xhr.withCredentials = true;
    xhr.open(config.method || 'GET', config.url + __convertParamsToString(config.params));
    xhr.send();
  }

  function __delegate(el, className, eventName, callback, stop) {
    el.addEventListener(eventName, function(e) {
      var target = e.target;
      while (target && target !== el) {
        if (target.classList.contains(className)) {
          callback(target);
          if (stop) {
            e.stopPropagation();
          }
        }
        target = target.parentNode;
      }
    });
  }

  function __forEach(target, callback) {
    if (!target) {
      return;
    }

    if (Array.isArray(target) && typeof target.forEach === 'function') {
      target.forEach(callback);
      return;
    }

    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        callback(target[key]);
      }
    }
  }
  /* ---- utils end ---- */

  /* ---- exports ---- */
  if (typeof exports === 'object') {
    module.exports = AreaSelector;
  } else if (typeof define === 'function' && define.amd) {
    define([], AreaSelector);
  } else {
    window.AreaSelector = AreaSelector;
  }
})();
