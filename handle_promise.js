
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(exector) {
    if(typeof exector !== 'function') {
      throw new TypeError(`Promise resolver ${exector} is not a function`)
    }

    try {
      exector(this.resolve, this.reject)
    } catch (error) {
      // 如果有错误，就直接执行 reject
      this.reject(error)
    }
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
    const promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);

          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === REJECTED) {

        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })

      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        });
      }
    })

    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if(promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

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
