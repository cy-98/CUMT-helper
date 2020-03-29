import {
  decrypt,
} from "../../utils/util.js"

const parseAccount = (text)=>{
  const data = JSON.parse(JSON.parse(decrypt(text)))
  const account = JSON.parse(data.Msg).query_card.card[0] // 查询信息
  return account
}

module.exports= {
  parseAccount: parseAccount
}