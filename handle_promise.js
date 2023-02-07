
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(exectutor) {
    if(typeof exectutor !== 'function') {
      throw new TypeError(`Promise resolver ${exectutor} is not a function`)
    }


    exectutor(this.resolve, this.reject)
  }

  status = PENDING

  value = undefined

  reason = undefined

  onFulfilledCallbacks = []
  onRejectedCallbacks = []


  resolve = (value) => {
    if(this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      while(this.onFulfilledCallbacks.length > 0) {
        this.onFulfilledCallbacks.shift()(this.value)
      }
    }
  }

  reject = (reason) => {
    if(this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      while(this.onRejectedCallbacks.length > 0) {
        this.onRejectedCallbacks.shift()(this.reason)
      }
    }
  }


  then(onFulfilled, onRejected) {
    if(this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    } else if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        const x = onFulfilled(this.value)
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        onRejected(this.reason)
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    })

    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 Promise 实例对象
  if(x instanceof Promise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = Promise
