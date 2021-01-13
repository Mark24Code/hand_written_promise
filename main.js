const Promise = require('./promise.js')

let p = new Promise((resolve,reject) => {
    resolve('ok')
})

p.then(value => {
    console.log(value)
}, reason => {
    console.warn(reason)
})