
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

  resolve = (value) => {
    if(this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }

  reject = (reason) => {
    if(this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
    }
  }


  then(onFulfilled, onRejected) {
    if(this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}


module.exports = Promise
