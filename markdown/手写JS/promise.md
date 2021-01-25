# promise

`Promise`对象有以下两个特点:

1. 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

1. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

## 核心
```javascript
const PENDING_STATE = "pending";
const FULFILLED_STATE = "fulfilled";
const REJECTED_STATE = "rejected";

function Promise(fn){
    this.callbacks = [];
    this.state = PENDING_STATE;//增加状态
    this.value = null;//保存结果
    fn(this._resolve.bind(this), this._reject.bind(this));
}

Promise.prototype.then = function(onFulfilled, onRejected){
    return new Promise((resolve, reject) => {
        this._handle({
            onFulfilled: onFulfilled || null,
            onRejected: onRejected || null,
            resolve: resolve,
            reject: reject
        });
    });
}

Promise.prototype._handle = function(callback){
    if (this.state === PENDING_STATE) {
        this.callbacks.push(callback);
        return;
    }
    let cb = this.state === FULFILLED_STATE ? callback.onFulfilled : callback.onRejected;
    if (!cb) {//如果then中没有传递任何东西
        cb = this.state === FULFILLED_STATE ? callback.resolve : callback.reject;
        cb(this.value);
        return;
    }
    let ret;
    try {
        ret = cb(this.value);
        cb = this.state === FULFILLED_STATE ? callback.resolve : callback.reject;
    } catch (error) {
        ret = error;
        cb = callback.reject
    } finally {
        cb(ret);
    }
}

Promise.prototype._resolve = function(value){
    if (value && (typeof value === 'object' || typeof value === 'function')) {
        var then = value.then;
        if (typeof then === 'function') {
            then.call(value, this._resolve.bind(this), this._reject.bind(this));
            return;
        }
    }

    this.state = FULFILLED_STATE;//改变状态
    this.value = value;//保存结果
    this.callbacks.forEach(callback => this._handle(callback));
}

Promise.prototype._reject = function(error){
    this.state = REJECTED_STATE;
    this.value = error;
    this.callbacks.forEach(callback => this._handle(callback));
}
```

## 扩展

### Promise.prototype.then()
```typescript
Promise.prototype.then = function(onFulfilled, onRejected){
    return new Promise((resolve, reject) => {
        this._handle({
            onFulfilled: onFulfilled || null,
            onRejected: onRejected || null,
            resolve: resolve,
            reject: reject
        });
    });
}
```

### Promise.prototype.catch()
```typescript
Promise.prototype.catch = function (onError) {
    return this.then(null, onError);
};
```

### Promise.prototype.finally()
```typescript
Promise.prototype.finally = function (onDone) {
    if (typeof onDone !== 'function') return this.then();
    return this.then(
      value => Promise.resolve(onDone()).then(() => value),
      reason => Promisep.resolve(onDone()).then(() => { throw reason })
    );
};
```

### Promise.resolve()
```typescript
Promise.resolve = function (value) {
    if (value && value instanceof Promise) {
        return value;
    } else if (value && typeof value === 'object' && typeof value.then === 'function') {
        let then = value.then;
        return new Promise(resolve => {
            then(resolve);
        });
    } else if (value) {
        return new Promise(resolve => resolve(value));
    } else {
        return new Promise(resolve => resolve());
    }
};
```

### Promise.reject()
```typescript
Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
        reject(value);
    });
};
```

### Promise.all()
```typescript
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let fulfilledCount = 0
        const itemNum = promises.length
        const rets = Array.from({ length: itemNum })
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(result => {
            fulfilledCount++;
            rets[index] = result;
            if (fulfilledCount === itemNum) {
                resolve(rets);
            }
            }, reason => reject(reason));
        })
    })
}
```

### Promise.allSettled()
```typescript
Promise.allSettled = function () {
  	// TODO
}
```

### Promise.race()
```typescript
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(function (value) {
                return resolve(value)
            }, function (reason) {
                return reject(reason)
            })
        }
    })
}
```

### Promise.try()
```typescript
Promise.try = function () {
   // TODO
}
```

## 练习题

### 习题一
```javascript
console.log(1);

new Promise((resolve)=>{
    resolve(2);
    console.log(3);
}).then(console.log.bind(console));

setTimeout(()=>{
  console.log(4);
});

new Promise((resolve)=>setTimeout(()=>resolve(5)))
  .then(console.log.bind(console));

new Promise((resolve)=>resolve(6))
  .then(console.log.bind(console));

console.log(7);
```

正确答案：1 3 7 2 6 4 5 

清空完所有**可以执行**的微任务队列，再执行一个宏任务队列。

## 资源

- [Promises/A+](https://promisesaplus.com/)
- [Promises/A+ 规范（译本）](https://juejin.cn/post/6910476633405128711)
- [【翻译】Promises/A+规范](https://www.ituring.com.cn/article/66566)
- [深入 Promise(一)——Promise 实现详解](https://zhuanlan.zhihu.com/p/25178630)
- [按照 Promise/A+ 手写Promise，通过promises-aplus-tests的全部872个测试用例](https://juejin.cn/post/6910500073314975758)
- [9k字 | Promise/async/Generator实现原理解析](https://juejin.cn/post/6844904096525189128)
- [我如何实现Promise](https://juejin.cn/post/6844903872842956814)
- [图解 Promise 实现原理（一）—— 基础实现](https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247486661&idx=1&sn=8e4b3056aa9c110ca08047d0917290f4&chksm=ebd87c57dcaff54168d1a8f94b074fa814270b9753d8c1e7eebe3b4203254ecb0e6989ba1f19&scene=21#wechat_redirect)
- [图解 Promise 实现原理（二）—— Promise 链式调用](https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247486706&idx=2&sn=9434eb4f5ea43e46de70a6486afbffbf&chksm=ebd87c60dcaff57669d389cf114a993b15df789b1b14fe1f4c89e38d304d79489dc5394e9296&scene=21#wechat_redirect)
- [图解 Promise 实现原理（三）—— Promise 原型方法实现](https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247486850&idx=2&sn=647638dbb430da2c23a1320033fc806f&chksm=ebd87d10dcaff40681acb2ee93b5516ae190e1111938fc72da12178e3d7f9c9fe5ffa0569254&scene=21#wechat_redirect)
- [图解 Promise 实现原理（四）—— Promise 静态方法实现](https://mp.weixin.qq.com/s/Lp_5BXdpm7G29Z7zT_S-bQ)
- [JavaScript Visualized: Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)
