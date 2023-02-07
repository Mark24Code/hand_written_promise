# 手写 Promise


## 文件说明

### 1. pass_all_test_promise_example.js

`example/pass_all_test_promise_example.js`

是最终通过测试的文件

`npm run test:example` 来验证测试。


### 2. index.js

开发过程中用来执行原生 Promise 对齐的文件

`npm run test:index` 代为执行这个脚本。

### 3. handle_promise.js

手写 Promise 文件

### 4. handle_test.js

开发过程中，针对手写 Promise 前期的简单测试。

`npm run test:dev`

## 补充

对手写 Promise 进行 标准测试用例测试

`npm run test`


----

# 技巧

1. promise 的状态唯一性不可逆转

全局存储这个状态。判断状态再改变。

1. 多次 then 调用

使用数组缓存。
根据状态判断，再从缓存的结果中拿出来执行。

1.1 多个 then 问题

因为是数组缓存，并且是循环直接执行。
所以多个then之间完全是并行的行为。

只有每一个 then 链条才是不断的返回新的 Promise 是串行关系。
串行关系就是存在依赖关系的回调。


2. then 的链式调用

一个 Promise 拥有一个 then 方法，作为一个基本单元。

每个 then 返回一个新 Promise 实例，这样来制造链式效果。


2.1 then 返回一个 promise 的问题

那么会把当前关注的 then 内容，挂在这个 返回的

3. resolve 和 then 调用时机

如果 resolve 是立即执行的。
那么 resolve 扭转的状态后，顺序执行到后面 then 的代码，会根据前面的状态进行处理。


如果 resolve 是异步执行。
后续 then 的代码会被注册，因为状态并未执行。

最后 resolve 被执行的时候，这时候会主动调用之前注册 then 在正确的 state 下执行回掉。

他们分别在时机上互相补充关系。


ME：所谓的帮助解决回掉地狱问题，也就是通过 Promise 内部缓存 then 注册执行函数这么一个特点。做到一种延迟计算。

从一个请求回来后，把结果交给了 Promise 内部的 state、value。再有 Promise 的 then 约定接口，生出一个新的 Promise 来反映。

他们的关系就像是通过了外部的一个缓存变量。把很多回调关系串起来了。

巧妙一点的就是 每个 then 返回 Promise 从而实现链式调用。

TODO？

一个 Promise 里面 return 一个 Promise 的过程

实际上 Promise 对理解复杂的应用过程非常重要。

除了花式的语法之外。
业务逻辑里最重要的就是 Promise 进行请求时候的代码了。

务必搞定。


4. Promise.then

内部是有一个微任务来执行内容的。

Promise.resolve 创建了2次微任务

https://juejin.cn/post/6953452438300917790


5. ME 思考 多个 .then

每一个 then 都会返回一个 Promise

如果 Promise 是 fullfilled 就会传值下去执行

如果是 连着多个往往后面会产生 数个 pending 的promise

他们没有名字，但是以闭包的形式关联存在在内存中。
并且可以保持调用关系

（就是 then 里面的 promise2）

直到微任务队列开始工作，逐步执行每一个 then 内部回调 ，开始从内存中逐个的调取对象，逐个 promise 化的执行。

每个 promise 都创建在堆中。

只有 微任务的回调工作在任务栈 中，准备吊起之前 的promise。

promise 那么多链式的 then 除了第一个其他不用看的原因也在这里。
思维不会收到影响。

但是扫描 promise.then 代码本身是宏任务会在第一次完成。


# 拓展

* [45道Promise面试题](https://github.com/LinDaiDai/niubility-coding-js/blob/master/JavaScript/%E5%BC%82%E6%AD%A5/%E8%A6%81%E5%B0%B1%E6%9D%A545%E9%81%93Promise%E9%9D%A2%E8%AF%95%E9%A2%98%E4%B8%80%E6%AC%A1%E7%88%BD%E5%88%B0%E5%BA%95.md)
