const promise = new Promise((resolve, reject) => {
  resolve('success')
  reject('err')
})

promise.then(value => {
 console.log('resolve', value)
}, reason => {
 console.log('reject', reason)
})

// 输出 resolve success
