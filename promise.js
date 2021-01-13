function Promise(executor) {

    // 添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;

    // 保存this值指向实例，保留给resolve，reject
    const self = this;

    //resolve 和 reject会改变状态
    function resolve(data) {
        // 1.修改对象状态 promiseState
        // 2.修改对象结果值 promiseResult

        if (self.PromiseState === 'pending') {
            self.PromiseState = 'fulfilled';
            self.PromiseResult = data;
        }
    }

    // reject
    function reject(data) {
        // 1.修改对象状态 promiseState
        // 2.修改对象结果值 promiseResult
        if(self.PromiseState === 'pending') {
            self.PromiseState = 'rejected';
            self.PromiseResult = data;
        }

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
Promise.prototype.then = function (onResolve, onRejected) {
    if(this.PromiseState === 'fulfilled') {
        onResolve(this.PromiseResult)
    } 

    if(this.PromiseState === 'rejected') {
        onrejectionhandled(this.PromiseResult)
    }
    
}


// module.exports = Promise;