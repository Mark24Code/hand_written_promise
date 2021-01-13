function Promise(executor) {

    // 添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;

    this.callbacks = [];


    // 保存this值指向实例，保留给resolve，reject
    const self = this;

    //resolve 和 reject会改变状态
    function resolve(data) {
        // 1.修改对象状态 promiseState
        // 2.修改对象结果值 promiseResult

        if(self.PromiseState !== 'pending') {
            return
        }

        self.PromiseState = 'fulfilled';
        self.PromiseResult = data;
        // 应该去调用 then
        self.callbacks.forEach(item => {
            item.onResolved(data)
        })
    }

    // reject
    function reject(data) {
        // 1.修改对象状态 promiseState
        // 2.修改对象结果值 promiseResult
        if (self.PromiseState !== 'pending') {
            return
        }

        self.PromiseState = 'rejected';
        self.PromiseResult = data;
        // 应该去调用 then
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

// 不同的状态对应不同的回调函数
// 调用then的是实例，所以可以用this
// 并且可以传入回调的值
Promise.prototype.then = function (onResolved, onRejected) {
    if(this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult)
    } 

    if(this.PromiseState === 'rejected') {
        onrejectionhandled(this.PromiseResult)
    }
    
    // 异步
    if (this.PromiseState === 'pending') {
        // 应该是pending的时候就不调用
        // 改变状态的时候就去调用
        // 改变状态的 onResolved、onRejected后面又如何调用then呢？
        // 为了让他们可以调用then
        // 要保存回调函数
        this.callbacks.push({
            onResolved: onResolved,
            onRejected: onRejected
        })
    }
}


// module.exports = Promise;