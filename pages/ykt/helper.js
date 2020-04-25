import {
  decrypt,
} from "../../utils/util.js"
import { getBalance, getOrder, recharge } from "../../utils/api.js"

const fetchBalance = ()=>{
  return getBalance().then(res => {
    const text = res.data.data
    const account = parseAccount(text)
    // const balance = parseBalance(account, "db_balance")

    return account
  })
}

const fetchOrder = (id) => {
  const params = {
    account: id,
    start: '2020-03-12',
    end: '2020-01-12',
    page: 1,
    row: 600
  }
  
  return getOrder(params)
    .then(res => {
      const orderList = parseOrder(res)
      console.log(orderList)
      return orderList
    })
}

const parseAccount = (text)=>{
  const data = JSON.parse(JSON.parse(decrypt(text)))
  const account = JSON.parse(data.Msg).query_card.card[0] // 查询信息
  return account
}

const parseBalance = (account,key="db_balance")=>{
  const balance = account[key]
  const int = balance.split('')
  const float = int.splice(-2)
  return int.join('') + '.' +float.join('')
}

const processParamsForOrder = ({ account, start, end, page, row })=>{
  const params = {}
  params.account = account
  params.start = start? start : '0'
  params.end = end? end: '0'
  params.page = page? page : 1
  params.row = row? row :  600
  return params
}

const parseOrder = (res)=>{
  const text = res.data.data
  const data = JSON.parse(JSON.parse(decrypt(text)))
  const orderList = data.rows
  return orderList
}


module.exports= {
  fetchBalance: fetchBalance,
  fetchOrder: fetchOrder,
  parseOrder: parseOrder,
  parseBalance: parseBalance,
  parseAccount: parseAccount,
  processParamsForOrder: processParamsForOrder
}