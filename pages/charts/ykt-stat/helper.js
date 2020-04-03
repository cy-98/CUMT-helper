const processOutMap = (outMap) => {
    const stack = []
    const eatery = {
        '3': '三食堂',
        '2': '二食堂',
        '南': '一食堂'
    }
    const tempMap = {}
    let rest = 0
    for (let key in outMap) {
        const value = Math.round(outMap[key])
        const flag = key[0]

        if (!eatery[flag]) {
            value <= -6 &&         // 小额消费
                stack.push({
                    name: key.trim(),
                    value: value
                })
            value > -6 &&
                (rest += value)

        } else {
            key = eatery[flag]
            tempMap[key] ?
                (tempMap[key] += value) :
                (tempMap[key] = value)
        }
    }

    for (const key in tempMap) {
        const value = tempMap[key]
        stack.push({
            name: key.trim(),
            value: value
        })
    }
    stack.push({
        name:"其他",
        value: rest
    })

    return stack
}

const processDateMap = (dateMap) => {
    const stack = []
    for (const key in dateMap) {
      const value = Math.abs((Math.round(dateMap[key])))
      if(value >= 100){
        stack.push({
          name: key,
          value: value
        })
      }
    }
    stack.sort((a,b) => a.name - b.name)
    return stack
}


module.exports = {
    processDateMap: processDateMap,
    processOutMap: processOutMap
}