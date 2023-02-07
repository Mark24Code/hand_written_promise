
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
}

module.exports = Promise
