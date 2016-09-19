[![NPM](https://nodei.co/npm/eleme-area-selector.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/eleme-area-selector/)

[![npm version](https://badge.fury.io/js/eleme-area-selector.svg)](https://badge.fury.io/js/eleme-area-selector)
[![CircleCI](https://circleci.com/gh/ppq1991/eleme-area-selector/tree/master.svg?style=svg)](https://circleci.com/gh/ppq1991/eleme-area-selector/tree/master)

# eleme-area-selector

控件本质是一个多级联下拉菜单，配上多选和 Tags 组件，用于数据门户、EMA 的区域筛选功能。

### 用法

###### 引用

```html
<script src="//unpkg.com/eleme-area-selector/dist/index.min.js"></script>
```

###### NPM

```
npm i eleme-area-selector
```

### 配置

###### 基础配置

`new AreaSelector([options])`

###### options 参数

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| api | 所有内置数据类型的 base url，需要使用自定义类型时才需要修改 | String | `/api/other/filter/` |
| style | 样式文件的 CDN 地址 | String | `//unpkg.com/eleme-area-selector/dist/style.css` |
| selectItemStyle | 列表中单位的高度和按需加载的单位 | Object | { height: 27, display: 20 } |
| selectSliceLength | 开启按需加载的列表长度，超过这个数值则开启按需加载 | Number | 200 |
| typeMap | 内置的数据门户常用过滤器类型(以前他们说绝对不加新的了 WTF | Object | [see]( #内置类型列表 ) |
| types | 当前实例展示的可选类型，大于 1 个时会显示一个下拉菜单供选择(如果不需要，可以直接使用样式来隐藏 | Array | ['交易平台BU'] |
| onReady | 数据加载完毕，默认选项有值 | Function | null |
| onChange | 选项的选中状态发生了改变 | Function | null |
| onTypeChange | 用户通过下拉菜单改变了 type 值 | Function | null |
| loadingMessage | 文案 | Array | ['正在加载资源...', '正在请求数据...'] |
| responseHandler | 得到返回数据后的处理函数，会传入两个参数，第一个为接口返回的原始数据，第二个为后续的 Build 方法，需要把处理完成后的数据传递进去 | Function | null |

##### 实例方法

```javascript
var as = new AreaSelector();

as.setParams({ key: 'value' }); // 会立即触发一次数据请求

as.clearAll(); // 清空当前选择项

```

### 调用方式

##### 简单实例

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
  cache: true,
  onReady: function() { console.log('ready!') },
  onChange: function() { console.log('changed! current value is:', as.getModel()) }, // { level: 1, data: '123,3453,676,1' }
  onTypeChange: function(type) { console.log('current type is:', type) }
})
```

##### 内置类型列表

```javascript
{
  '交易平台BU': { id: 'bu', params: { time: 'hour' } },
  '红包': { id: 'redReward' },
  'BOD': { id: 'bod' },
  '高校': { id: 'business/gx' },
  '白领': { id: 'business/bl' },
  '早餐': { id: 'breakfast' },
  '城市补贴与优惠': { id: 'cityAllowance' },
  '城市': { id: 'cityAllowance' }
}
```

##### 使用内置类型

```javascript
new AreaSelector(document.getElementById('app'), {
  types: ['交易平台BU', '城市'],
  responseHandler: (data, success) => {
    if (data && data.code === 200 && data.data) {
      return data.data;
    }
  }
})
```

##### 使用自定义类型

```javascript
new AreaSelector(document.getElementById('app'), {
  api: '/api/filter',
  typeMap: {
    '自定义': { id: 'custom', params: { key1: 'value1' } }
  },
  // 请求会组装成 /api/filter/custom?key1=value
  types: ['自定义'],
  responseHandler: (data, success) => {
    if (data && data.code === 200 && data.data) {
      return data.data;
    }
  }
})
```
