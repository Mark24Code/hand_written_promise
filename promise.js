function Promise(executor) {
    // executor 是同步执行的,直接执行就好
    executor(resolve, reject);
    
}

Promise.prototype.then = function (onResolve, onReject) {
    
}


module.exports = Promise;