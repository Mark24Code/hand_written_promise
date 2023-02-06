
class Promise {
  constructor(exectutor) {
    if(typeof exectutor !== 'function') {
      throw new TypeError(`Promise resolver ${exectutor} is not a function`)
    }

    const resolve = function(value) {
      // 成功的一系列操作
    }

    const reject = function(reason) {
      // 失败的一系列操作
    }

    exectutor(resolve, reject)
  }


}


module.exports = Promise
