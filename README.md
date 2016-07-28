# eleme-area-selector

### 简介

控件本质是一个多级联下拉菜单，配上多选和 Tags 组件，用于数据门户、EMA 的区域筛选功能。

### 用法

#### 引用

```html
<script src="//npm.elemecdn.com/eleme-area-selector@0.2.1/dist/index.min.js"></script>
```

#### 配置

##### 基础配置

```javascript
var DEFAULT_CONFIG = {
  api: DEFAULT_ORIGIN, // api 地址
  style: DEFAULT_STYLE_ORIGIN, // 样式 CDN 地址，无需修改
  selectItemStyle: { height: 27, display: 20 }, // 默认选择项样式
  selectSliceLength: 200, // 开启按需加载的长度
  typeMap: DEFAULT_TYPES_MAP, // 内置的类型映射表
  onReady: null, // ready 事件
  onChange: null, // 选择状态发现了变化
  onTypeChange: null, // 类型发生了变化，初始化时会触发一次
  loadingMessage: ['正在加载资源...', '正在请求数据...'], // 加载时的文案
  types: ['交易平台BU'], // 当前显示类型
  responseHandler: DEFAULT_RESPONSE_HANDLER // api 返回值的处理函数，传入参数是 (data, callback)
};
```

##### 调用方式

```html
<div id="app"></div>
```

```javascript
as = new AreaSelector(document.getElementById('app'), {
  api: '/api/filter',
  typeMap: {
    '交易平台BU': { id: 'bu', params: { key1: 'value1' } }    // 请求会组装成 /api/filter/bu?key1=value1
  },
  types: ['交易平台BU', '城市'],
  onReady: function() { console.log('ready!') },
  onChange: function() { console.log('changed! current value is:', as.getModel()) }, // { level: 1, data: '123,3453,676,1' }
  onTypeChange: function(type) { console.log('current type is:', type) }
})

// destroy
function destroy() {
  as.$destroy();
}
```
