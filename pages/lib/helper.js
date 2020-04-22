//数组中去五个数

const fiveRandomBooks = (arr)=> {
  const length = arr.length
  let res = []
  
  for(let i = 0; i < 5; i++) {
    const random = Math.random() * length & 0
    res = res.concat(
      arr.splice(random, 1)[0]
    )
  }
  return res
}
module.exports = {
  fiveRandomBooks: fiveRandomBooks
}