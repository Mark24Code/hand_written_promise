function Promise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    this.callbacks = [];
    const self = this;

    function resolve(data) {
        if (self.PromiseState !== 'pending') { return }

        self.PromiseResult = data
        self.PromiseState = 'fulfilled'

        self.callbacks.forEach(item => {
            item.onResolved(data)
        })
    }

    function reject(data) {
        if (self.PromiseState !== 'pending') { return }

        self.PromiseResult = data
        self.PromiseState = 'rejected'

        // 平行注册的then，所有都执行
        // p.then
        // p.then …… 这种 
        self.callbacks.forEach(item => {
            item.onRejected(data)
        })

    }

    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    const self = this;

    // 这里值得一提的是一级一级传递的
    // 一旦产生rejected，就会沿着所有的rejected一路向下传递
    if(typeof onRejected !== 'function') {
        // 参数没有传的时候，补齐一个参数
        // 通过在中间补齐一个标准参数，这样不需要破坏后面的结构。这也算是一种思想。不需要后面加入if-else
        onRejected = reason => {
            throw reason
        }
    }

    // 这样相当于提供了 值穿透 的实现
    // p.then()
    // .then(val => { ... })
    // 这样相当于当 空then出现 
    if(typeof onResolved !== 'function') {
        onResolved = value => value;
    }

    // 符合Promise A+标准
    // then 的返回应该是一个Promise对象
    return new Promise((resolve, reject) => {

        // 封装相同逻辑
        function callback(type) {
            try {
                // 要根据这个then运行的结果，来决定返回的Promise自己的状态
                // 这里有个状态同步的过程
                const result = type(self.PromiseResult)

                // PromiseA+标准，不同的对象返回不同的promise
                if (result instanceof Promise) {
                    // 如果是一个Promise的对象
                    // 需要执行到then才知道Promise的返回（同步or异步任务）

                    result.then(v => {
                        resolve(v)
                    }, r => {
                        reject(r)
                    })
                } else {
                    // 单纯的值，使用本次Promise的resolve
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }

        // 本来内部是直接工作的
        // 为了返回是Promise对象，需要把内部的逻辑，同步到这个返回Promise中

        // 相当于同步执行的then
        if (self.PromiseState === 'fulfilled') {
            callback(onResolved)
        }

        if (self.PromiseState === 'rejected') {
            callback(onRejected)
        }


        // 相当于异步执行的then
        if (self.PromiseState === 'pending') {
            self.callbacks.push({
                onResolved: function () {
                    // 同步和异步任务无意外
                    // 异步任务发起调用
                    // 这里依然通过闭包去修改本次返回Promise的状态

                    // 思考：不断地调用预留函数，在时空里，就是延迟计算了，一轮一轮的计算在运算栈里，相当于推迟计算
                    callback(onResolved)
                },
                onRejected: function () {
                    callback(onRejected)
                }
            })
        }
    })
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        if( value instanceof Promise) {
            value.then(v=>{
                resolve(v)
            }, r => {
                reject(r)
            })
        } else {
            resolve(value)
        }
    })
}

Promise.reject = function (value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(v => {
                reject(v)
            }, r => {
                reject(r)
            })
        } else {
            reject(value)
        }

        // 另一个实现,但是我觉得上面的更好
        // reject(value)
    })
}

Promise.all = function (promises = []) {
    return new Promise((resolve, reject) => {
        // 声明成功的计数变量
        let count = 0;
        // 成功结果变量
        let arr = [];

        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                count++;

                // arr.push(v) 这个不够完美因为顺序会出问题
                arr[i] = v; // 按照顺序直接赋值

                if (count === promises.length) {
                    // 都成功了,可以改变这个Promise的状态
                    resolve(arr);
                }
            }, r => {
                reject(r)
            })
        }
    })
}



Promise.race = function (promises = []) {
    return new Promise((resolve, reject) => {

        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                // 第一个结果就是成功
                // then本来就是在对方成功之后才会被调用。
                resolve(v)
            }, r => {
                reject(r)
            })
        }
    })
}