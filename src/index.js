;(function(){

  var VERSION = '0.2.1';

  var DATA_CACHE = {};

  /* --- 内置数据门户配置 --- */
  var DEFAULT_TYPES_MAP = {
    '交易平台BU': { id: 'bu', params: { time: 'hour' } },
    '红包': { id: 'redReward' },
    'BOD': { id: 'bod' },
    '高校': { id: 'business/gx' },
    '白领': { id: 'business/bl' },
    '早餐': { id: 'breakfast' },
    '城市补贴与优惠': { id: 'cityAllowance' },
    '城市': { id: 'cityAllowance' }
  };

  var DEFAULT_ORIGIN = '/api/other/filter/';

  var DEFAULT_RESPONSE_HANDLER = function (res, callback) {
    if (res.data && res.code === 200) {
      callback(res.data);
    } else {
      console.error(res.code, res.message);
    }
  }

  var DEFAULT_STYLE_ORIGIN = '//npm.elemecdn.com/eleme-area-selector@' + VERSION + '/dist/style.css';
  /* --- 内置数据门户配置 END --- */

  var DEFAULT_CONFIG = {
    api: DEFAULT_ORIGIN,
    style: DEFAULT_STYLE_ORIGIN,
    selectItemStyle: { height: 27, display: 20 },
    selectSliceLength: 200,
    typeMap: DEFAULT_TYPES_MAP,
    onReady: null,
    onChange: null,
    onTypeChange: null,
    loadingMessage: ['正在加载资源...', '正在请求数据...'],
    types: ['交易平台BU'],
    cache: false,
    cacheKey: 'EAS-CACHE',
    responseHandler: DEFAULT_RESPONSE_HANDLER
  };

  function AreaSelector(el, config) {
    this.el = el;
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.$init();
  }

  AreaSelector.version = VERSION;

  AreaSelector.prototype = {
    $init: function() {
      this.el.innerHTML = this.config.loadingMessage[0];
      this.$initCache();

      // has load ?
      if (!document.querySelector('[data-id=EAS-Style]')) {
        var style = createElement('link', { rel: 'stylesheet', href: this.config.style }, { id: 'EAS-Style' });
        var $self = this;
        style.onload = function functionName() {
          $self.$setCurrentType();
        };
        append(document.head, style);
      } else {
        this.$setCurrentType();
      }
    },

    $setCurrentType: function(type) {
      if (!type) { type = this.config.types[0] }
      if (this.config.onTypeChange) { this.config.onTypeChange(type) }

      this.currentType = type;
      this.$load();
    },

    $load: function() {
      this.el.innerHTML = this.config.loadingMessage[1];
      this.model = [];
      this.data = {};
      this.keyword = '';
      this.selects = {};

      // has build ?
      if (!isEmpty(this.refs)) {
        this.$clear();
      }

      this.refs = {};

      if (DATA_CACHE[this.currentType]) {
        this.$build(DATA_CACHE[this.currentType]);
      } else {
        fetchData({
          url: this.config.api + this.config.typeMap[this.currentType].id,
          params: this.config.typeMap[this.currentType].params
        }, (function(data) {
          if (this.config.responseHandler) {
            this.config.responseHandler(data, this.$build.bind(this));
          } else {
            this.$build(data);
          }
        }).bind(this));
      }
    },

    $clear: function() {
      this.$eventsHandlerRemove.forEach(function(item) { item() });
      this.$eventsHandlerRemove = [];

      remove(this.refs.container);
      remove(this.refs.selectContainer);
    },

    $destroy: function() {
      this.$clear();
      this.$saveCache();
      this.config.onChange = null;
      this.config.onReady = null;
      this.config.onTypeChange = null;

      var $self = this;
      forEach(this, function(key) {
        if (typeof key === 'function') {
          $self[key] = null;
        }
      })
    },

    $addEventListener: function(el, eventName, func) {
      el.addEventListener(eventName, func);
      this.$eventsHandlerRemove.push(function() { el.removeEventListener(eventName, func) });
    },

    $build: function(data) {
      this.data = data;
      DATA_CACHE[this.currentType] = data;

      var refs = this.refs;
      var $self = this;
      this.$eventsHandlerRemove = [];

      // create basic element
      refs.container = createElement('div', { className: 'eas-container' });
      refs.inputContainer = createElement('div', { className: 'input-container' });
      refs.typeBox = createElement('div', { className: 'type-box' });
      refs.type = createElement('div', { className: 'current-type' });
      refs.typeList = createElement('ul', { className: 'type-list' });
      refs.input = createElement('input', { className: 'eas-input', type: 'search' });

      refs.resultContainer = createElement('div', { className: 'result-container' });
      refs.clearAll = createElement('div', { className: 'clear-all', innerHTML: '清除全部' });
      refs.tags = createElement('div', { className: 'eas-tags' });

      refs.selectContainer = createElement('div', { className: 'eas-selects' });

      // build
      this.el.innerHTML = '';
      append(refs.container, refs.inputContainer, refs.resultContainer);
      append(refs.typeBox, refs.type, refs.typeList);
      append(refs.inputContainer, refs.typeBox, refs.input)
      append(refs.resultContainer, refs.tags, refs.clearAll);

      this.refs.type.innerHTML = this.currentType;
      this.$buildTypeList();

      // event handler
      this.$addEventListener(document.body, 'click', function() { $self.$hideSelect(0) });

      this.$addEventListener(this.refs.input, 'click', function(e) { $self.$showSelect(); e.stopPropagation() });

      this.$addEventListener(this.refs.input, 'input', function() { $self.$search() });

      this.$addEventListener(this.refs.clearAll, 'click', function() { $self.$clearAll() });

      delegate(this.refs.typeList, 'type-list-item', 'click', function(target) {
        $self.$setCurrentType(target.textContent)
      }, true);

      delegate(this.refs.selectContainer, 'eas-select-item', 'mousemove', function(target) {
        if (target === this.$lastMouseMoveTarget) { return; }
        this.$lastMouseMoveTarget = target;

        [].slice.call(target.parentNode.children).forEach(function(child) {
          if (child.classList.contains('hover')) {
            child.classList.remove('hover');
          }
        });
        target.classList.add('hover');

        var level = target.parentNode.dataset.level;
        var targetData = $self.selects[level].data[getIndex(target)];
        $self.$showSelect($self.selects[level], targetData);
      });

      delegate(this.refs.selectContainer, 'eas-select-item', 'click', function(target) {
        $self.$selectItem($self.selects[target.parentNode.dataset.level].display[getIndex(target)]);
        target.classList.add('selected');
      }, true);

      delegate(this.refs.tags, 'eas-tag', 'click', function(target) {
        $self.$removeItem(getIndex(target));
      });

      // append to page
      append(document.body, refs.selectContainer);
      append(this.el, refs.container);

      // build main select
      this.$buildMainSelelt();

      // set default select item or load from cache
      var model = this.data[0][0];

      if (this.config.cache) {
        // add save event
        window.addEventListener('unload', function() {
          $self.$saveCache();
        });

        if (this.cache && this.cache[location.pathname] && this.cache[location.pathname][this.currentType]) {
          model = Object.assign([], this.cache[location.pathname][this.currentType]);
          if (model.length === 0) {
            model = this.data[0][0];
          }
        }
      }
      model.reverse().forEach(function(item) {
        $self.$selectItem(item);
      });

      if (this.config.onReady) { this.config.onReady() }
    },

    $buildTypeList: function() {
      var $self = this;
      if (this.config.types.length > 1) {
        forEach(this.config.types, function(item) {
          append($self.refs.typeList, createElement('li', { className: 'type-list-item', innerHTML: item }));
        });
        this.refs.type.classList.add('list');
      } else {
        remove(this.refs.typeList);
      }
    },

    $buildMainSelelt: function() {
      // put all tree items into one Array
      var level = 0;
      var all = [];
      while (this.data[level]) {
        forEach(this.data[level], function(node) {
          forEach(node, function(item) {
            item.level = level;
            all.push(item);
          })
        })
        level++;
      }
      this.data.all = all;

      // calculate select position top
      var rect = this.refs.input.getBoundingClientRect();
      this.$selectTop = rect.top + rect.height;

      var el = this.$generateSelect(0);
      el.style.left = rect.left - 1 + 'px';
      el.style.top = this.$selectTop + 'px';
      el.style.display = 'none';

      append(this.refs.selectContainer, el);
    },

    $showSelect: function(previousSelect, parentData) {
      if (!previousSelect) {
        this.$refreshMainSelect();
        this.selects[0].el.style.display = 'block';
        this.$hideSelect(1);
      } else {
        this.$hideSelect(previousSelect.level + 1);
        if (parentData.level >= this.data.struct.length - 1) {
          return;
        }

        var el = this.$generateSelect(parentData.level + 1, parentData.i);
        var rect = previousSelect.el.getBoundingClientRect();
        el.style.top = this.$selectTop + 'px';
        el.style.left = rect.left + rect.width - 1 + 'px';
        append(this.refs.selectContainer, el);
      }
    },

    $hideSelect: function(level) {
      if (level === 0) {
        this.selects[0].el.style.display = 'none';
        level++;
      }
      for (; level < this.data.struct.length; level++) {
        if (this.selects[level]) {
          remove(this.selects[level].el);
          this.selects[level] = null;
        }
      }
    },

    $refreshMainSelect: function() {
      var $self = this;
      var data = this.data.all;
      if (this.keyword) {
        data = this.data.all.filter(function(item) {
          return item.n.toUpperCase().indexOf($self.keyword.toUpperCase()) > -1;
        });
      }
      this.$generateSelect(0, 0, data);
    },

    $generateSelect: function(level, parentId, presetData) {
      if (!this.data[level]) { return; }
      if (level === 0) { parentId = 0; }

      var el = createElement('ul', { className: 'eas-select' }, { level: level });
      var data = this.data[level][parentId];
      if (level === 0) {
        data = this.data.all;
      }
      if (presetData) {
        data = presetData;
      }

      var model = { el: el, data: data, level: level, display: data, fullLoaded: true };
      var $self = this;
      var slice = this.config.selectSliceLength;
      var itemHeight = this.config.selectItemStyle.height;
      var itemDisplay = this.config.selectItemStyle.display;

      // load more while needed
      if (data.length > slice) {
        model.fullLoaded = false;
        model.display = data.slice(0, slice);

        el.addEventListener('scroll', function() {
          if (model.fullLoaded) { return }

          if (this.scrollTop / itemHeight + itemDisplay > model.display.length) {
            model.data.slice(model.display.length - 1, model.display.length + slice).forEach(function(item) {
              append(el, $self.$generateSelectItem(item));
            })
            model.display = model.data.slice(0, model.display.length + slice);

            if (model.display >= model.data) {
              model.fullLoaded = true;
            }
          }
        })
      }

      model.display.forEach(function(item) {
        append(el, $self.$generateSelectItem(item));
      });

      if (this.selects[level] && this.selects[level].el) {
        Object.assign(el.style, this.selects[level].el.style);
        this.refs.selectContainer.replaceChild(el, this.selects[level].el);
      }
      this.selects[level] = model;
      return el;
    },

    $generateSelectItem: function(data) {
      var className = 'eas-select-item';
      if (this.model.some(function(item) {
        return item.i === data.i && item.level === data.level;
      })) {
        className += ' selected';
      }
      var el = createElement('li', { className: className });
      el.innerHTML = '<small>' + data.level + '</small><i>' + this.data.struct[data.level] + '</i><span>' + data.n + '</span>';
      return el;
    },

    $setCurrentLevel: function(level) {
      if (level > 0 && level < this.data.struct.length) {
        this.currentLevel = level;
      } else {
        this.currentLevel = 0;
      }
    },

    $selectItem: function(item) {
      if (!this.model.some(function(i) { return i.i === item.i && i.level === item.level; })) {
        this.model.unshift(item);
        this.$setCurrentLevel(item.level);
        this.$refreshModel();
      }
    },

    $removeItem: function(index) {
      this.model.splice(index, 1);
      var level = this.currentLevel;

      if (this.model.length === 0) {
        this.$setCurrentLevel(0);
      } else {
        if (!this.model.some(function(item) { return item.level === level })) {
          this.$setCurrentLevel(this.model[0].level);
        }
      }
      this.$refreshModel();
    },

    $clearAll: function() {
      this.model = [];
      this.$refreshModel();
    },

    getModel: function() {
      if (!this.model.length) {
        return { level: 1, data: '' };
      }
      var model = {};
      var level = this.currentLevel;
      model.level = level + 1;
      model.data = this.model.filter(function(item) { return item.level === level }).map(function(item) { return item.i }).join(',');
      return model;
    },

    $refreshModel: function() {
      var level = this.currentLevel;
      this.refs.tags.innerHTML = this.model.map(function(item) {
        var className = 'eas-tag';
        if (item.level !== level) {
          className += ' disabled';
        }
        return '<li class="' + className + '"><span>' + item.n + '</span><i></i></li>';
      }).join('');

      this.$setCache();
      if (this.config.onChange) { this.config.onChange() }
    },

    $initCache: function() {
      var cache = window.localStorage.getItem(this.config.cacheKey);
      var json = {};
      if (cache) {
        try {
          json = JSON.parse(cache);
          this.cache = json;
        } catch (e) {
          this.cache = {};
        }
      } else {
        this.cache = {};
      }
    },

    $setCache: function() {
      // todo: call only once after type change
      if (!this.cache[window.location.pathname]) {
        this.cache[window.location.pathname] = {};
      }
      this.cache[window.location.pathname][this.currentType] = Object.assign([], this.model);
    },

    $saveCache: function() {
      window.localStorage.setItem(this.config.cacheKey, JSON.stringify(this.cache));
    },

    $search: function() {
      this.keyword = this.refs.input.value.trim();
      this.$showSelect();
    }
  }


  /* ---- utils ---- */
  function append() {
    var args = [].slice.call(arguments);
    var parent = args.shift();
    args.forEach(function(child) {
      parent.appendChild(child);
    })
  }

  function remove(el) {
    if (!el) {
      return;
    }
    if (typeof el.remove === 'function') {
      el.remove();
    } else {
      el.parentNode.removeChild(el);
    }
  }

  function isEmpty(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

  function getIndex(node) {
    return [].indexOf.call(node.parentNode.children, node);
  }

  function createElement(tagName, params, attrs) {
    var el = document.createElement(tagName);
    if (params) {
      Object.assign(el, params);
    }
    if (attrs) {
      Object.assign(el.dataset, attrs);
    }
    return el;
  }

  function convertParamsToString(params) {
    if (!params) {
      return '';
    }
    return '?' + Object.keys(params).map(function(key) {
      return key + '=' + params[key];
    }).join('&');
  }

  function fetchData(config, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText) {
          var json = JSON.parse(xhr.responseText);
          if (json) {
            callback(json);
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
    xhr.open(config.method || 'GET', config.url + convertParamsToString(config.params));
    xhr.send();
  }

  function delegate(el, className, eventName, callback, stop) {
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

  function forEach(target, callback) {
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
  } else {
    window.AreaSelector = AreaSelector;
  }
})();
