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

        self.PromiseState = 'fulfilled';
        self.PromiseResult = data;
    }

    // reject
    function reject(data) {
        // 1.修改对象状态 promiseState
        // 2.修改对象结果值 promiseResult

        self.PromiseState = 'rejected';
        self.PromiseResult = data;
    }

    try {
        // executor 是同步执行的,直接执行就好
        executor(resolve, reject);
    } catch (error) {
        // 处理抛出异常
        reject(error)
    }

    
}

Promise.prototype.then = function (onResolve, onReject) {
    
}


// module.exports = Promise;