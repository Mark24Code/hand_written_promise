const promise = new Promise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve('success')
})

function other () {
  return new Promise((resolve, reject) =>{
    resolve('other')
  })
}
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})

// 1
// resolve success
// 2
// reoslve other

