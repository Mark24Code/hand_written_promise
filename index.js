const Promise = require('./handle_promise.js')

new Promise((resolve, reject) => {
  console.log('promise run')
  resolve(1)
  // setTimeout(() => {
  //   resolve(1)
  // })
})
// .then(value => {
//   console.log(value)
// }, reason => {
//   console.log(reason)
// })



new Promise(1)
