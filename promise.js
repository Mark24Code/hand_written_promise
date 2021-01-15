function Promise(executor) {

    this.PromiseState = 'pending';
    this.PromiseResult = null;

    this.callbacks = [];


    // 保存this值指向实例，保留给resolve，reject
    const self = this;

    //resolve 和 reject会改变状态
    function resolve(data) {
        if(self.PromiseState !== 'pending') {
            // 状态只能改变一次
            // 本质上是简化复杂度
            return
        }
        
        // 关键理解
        // 本质上这里 resolve就是一个回调而已
        // Promise是利用了一种回调，取代了原来简单的回调，增加心智负担
        // Promise只是解决then的问题，解决回调地狱，不是消灭回调
        // resolve,reject就是回调
        // 这种封装其实并不高级
        self.PromiseState = 'fulfilled';
        self.PromiseResult = data;
        self.callbacks.forEach(item => {
            item.onResolved(data)
        })
    }

    // reject
    function reject(data) {
        if (self.PromiseState !== 'pending') {
            return
        }

        self.PromiseState = 'rejected';
        self.PromiseResult = data;
        self.callbacks.forEach(item => {
            item.onRejected(data)
        })
    }

    try {
        // executor 是同步执行的,直接执行就好
        executor(resolve, reject);
    } catch (error) {
        // 处理抛出异常
        reject(error)
    }

    
}

// 关键理解
// then必须书写出来
// 书写出来就会执行，then的首次执行相当于预存了执行方法
// 如果 Promise的 resolve、reject延迟执行实际上是在某个时机，执行了预存then方法

// 只有在promise实例中，then的值，才是传递值
// 想要利用传递的值，需要在这里
// then就是一种回调了
Promise.prototype.then = function (onResolved, onRejected) {
    // 保持这边返回的也是一个Promise
    // 这里的this是绑定在外部的this上，也就是未来的实例 p
    const self = this;

    // p 的返回值onResolved，onRejected，会影响到本返回Promise的值
    // 所以，先要获得 onResolved的返回值，根据返回值判断，再修改自己的状态
    return new Promise((resolve,reject) => {

        // 这里其实是难理解的部分
        // 本质上利用了闭包
        // 老的实例方法then正在根据老实例的状态，尝试返回一个新的Promise
        // 这里是一个新老交接的逻辑
        // 如此这般便可以形成链条式调用的基础
        if (self.PromiseState === 'fulfilled') {

            try {
                // 获得回调结果
                let result = onResolved(self.PromiseResult)
                // 判断类型
                if (result instanceof Promise) {
                    // 如果是Promise的对象

                    result.then(v => {
                        resolve(v)
                    }, r => {
                        reject(r)
                    })
                } else {
                    // 如果单纯传值，就直接resolve值
                    resolve(result)
                }

            } catch (error) {
                reject(error)
            }
        }

        if (self.PromiseState === 'rejected') {
            onrejectionhandled(self.PromiseResult)
        }

        // 异步
        if (self.PromiseState === 'pending') {

            // onResolved,onRejected 就是then里面的书写内容
            // then里面的内容等于延迟计算了，先保存起来
            // 总实例的状态决定了何时调用
            self.callbacks.push({
                onResolved: function () {
                    try {
                        let result = onResolved(self.PromiseResult);
                        if (result instanceof Promise) {
                            result.then(v => {
                                // 控制反转
                                resolve(v)
                            }, r => {
                                reject(r)
                            })
                        } else {
                            resolve(result)
                        }
                    } catch (error) {
                        reject(error)
                    }

                },
                onRejected: function () {
                    try {
                        let result = onRejected(self.PromiseResult);
                        if (result instanceof Promise) {
                            result.then(v => {
                                // 控制反转
                                resolve(v)
                            }, r => {
                                reject(r)
                            })
                        } else {
                            resolve(result)
                        }
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        }

    })
}