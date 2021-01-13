function Promise(executor) {

    //resolve
    function resolve(data) {
        // data就是会传参数
    }

    // reject
    function reject(data) {
        
    }

    // executor 是同步执行的,直接执行就好
    executor(resolve, reject);
    
}

Promise.prototype.then = function (onResolve, onReject) {
    
}


module.exports = Promise;