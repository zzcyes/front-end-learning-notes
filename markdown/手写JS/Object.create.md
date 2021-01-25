# Object.create

`Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

## 示例
```javascript
const person = {
  isAdult: false,
  logIntroduce() {
    console.log(`My name is ${this.name}. Am I adult? ${this.isAdult}`);
  }
};
const kid = Object.create(person);
kid.name = 'zzcyes'; 
kid.isAdult = true; 
kid.logIntroduce(); // My name is zzcyes. Am I adult? true
```
```javascript
var o;

// 创建一个原型为null的空对象
o = Object.create(null);

o = {};
// 以字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);

o = Object.create(Object.prototype, {
  foo: {  // foo会成为所创建对象的数据属性
    writable:true,
    configurable:true,
    value: "hello"
  },
  bar: {  // bar会成为所创建对象的访问器属性
    configurable: false,
    get: function() { return 10 },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
});
```

## 语法
```
Object.create(proto，[propertiesObject])
```

## 参数

- `proto`

新创建对象的原型对象。

- `propertiesObject`

可选。需要传入一个对象，该对象的属性类型参照[`Object.defineProperties()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)的第二个参数。如果该参数被指定且不为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，该传入对象的自有可枚举属性(即其自身定义的属性，而不是其原型链上的枚举属性)将为新创建的对象添加指定的属性值和对应的属性描述符。

## 返回值
一个新对象，带着指定的原型对象和属性。

## 例外
如果`propertiesObject`参数是 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或非原始包装对象，则抛出一个 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 异常。

## 实现
```javascript
// 忽略第二个参数
function objectCreate (proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object: ' + proto);
  } else if (proto === null) {
    throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
  }
  if (typeof propertiesObject !== 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
  function F() {}
  F.prototype = proto;
  return new F();
 };
```

可参考[原型式继承](https://www.yuque.com/zzcyes/font-end-map/nbo0hb#B1pP8)
