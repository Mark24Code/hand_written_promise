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


2. then 的链式调用

一个 Promise 拥有一个 then 方法，作为一个基本单元。

每个 then 返回一个新 Promise 实例，这样来制造链式效果。

3. resolve 和 then 调用时机

resolve 专门来改变状态。有根据完成状态清空 缓存 then 函数的功能。
这个主要是适合异步情况。

then 函数执行的时候，会有根据状态缓存注册、或者执行。

他们分别在时机上互相补充关系。
