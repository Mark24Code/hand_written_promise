function Promise(executor) {

    this.PromiseState = 'pending';
    this.PromiseResult = null;

    this.callbacks = [];


    // 保存this值指向实例，保留给resolve，reject
    const self = this;

    //resolve 和 reject会改变状态
    function resolve(data) {
        if(self.PromiseState !== 'pending') {
            return
        }

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

Promise.prototype.then = function (onResolved, onRejected) {
    // 保持这边返回的也是一个Promise
    // 这里的this是绑定在外部的this上，也就是未来的实例 p
    const self = this;

    // p 的返回值onResolved，onRejected，会影响到本返回Promise的值
    // 所以，先要获得 onResolved的返回值，根据返回值判断，再修改自己的状态
    return new Promise((resolve,reject) => {

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
            self.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            })
        }

    })
}