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
    if(this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult)
    } 

    if(this.PromiseState === 'rejected') {
        onrejectionhandled(this.PromiseResult)
    }
    
    // 异步
    if (this.PromiseState === 'pending') {
        this.callbacks.push({
            onResolved: onResolved,
            onRejected: onRejected
        })
    }
}