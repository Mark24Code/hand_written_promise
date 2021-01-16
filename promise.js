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

    // 符合Promise A+标准
    // then 的返回应该是一个Promise对象
    return new Promise((resolve, reject) => {
        // 本来内部是直接工作的
        // 为了返回是Promise对象，需要把内部的逻辑，同步到这个返回Promise中

        // 相当于同步执行的then
        if (self.PromiseState === 'fulfilled') {
            try {
                // 要根据这个then运行的结果，来决定返回的Promise自己的状态
                // 这里有个状态同步的过程
                const result = onResolved(self.PromiseResult)

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

        if (self.PromiseState === 'rejected') {
            // reject 和 上面resolve保持一致
            try {
                const result = onRejected(self.PromiseResult)

                if (result instanceof Promise) {

                    result.then(v => {
                        resolve(v)
                    }, r => {
                        reject(r)
                    })
                } else {
                    reject(result)
                }
            } catch (error) {
                reject(error)
            }
        }


        // 相当于异步执行的then
        if (self.PromiseState === 'pending') {
            self.callbacks.push({
                onResolved: function () {
                    // 同步和异步任务无意外
                    // 异步任务发起调用
                    // 这里依然通过闭包去修改本次返回Promise的状态
                    try {
                        const result = onResolved(self.PromiseResult)

                        if (result instanceof Promise) {
                            result.then(v => {
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
                        const result = onRejected(self.PromiseResult)

                        if (result instanceof Promise) {

                            result.then(v => {
                                resolve(v)
                            }, r => {
                                reject(r)
                            })
                        } else {
                            reject(result)
                        }
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        }
    })
}