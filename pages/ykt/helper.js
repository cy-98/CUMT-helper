import {
  decrypt,
} from "../../utils/util.js"



const parseAccount = (text)=>{
  const data = JSON.parse(JSON.parse(decrypt(text)))
  const account = JSON.parse(data.Msg).query_card.card[0] // 查询信息
  return account
}

const parseBalance = (account,key)=>{
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
  parseOrder: parseOrder,
  parseBalance: parseBalance,
  parseAccount: parseAccount,
  processParamsForOrder: processParamsForOrder
}