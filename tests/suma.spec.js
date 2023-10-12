const suma = require("./suma")
const logger = require("../logger")

let totalTests = 0
let testPassed = 0

// 1
logger.debug("test1: retorna null cuando uno de los parametros no es numerico")
totalTests++
const result1 = suma("a", 3)
if (result1 === null) {
  logger.debug("test1: success")
  testPassed++
} else {
  logger.debug(`test1: fail. Se esperaba null. result: ${result1}`)
}

logger.debug(`Pasaron ${testPassed} de ${totalTests}`)

// 2
logger.debug("test2: retorna 0 cuando uno de los parametros no es numerico")
totalTests++
const result2 = suma()
if (result2 === 0) {
  logger.debug("test2: success")
  testPassed++
} else {
  logger.debug(`test2: fail. Se esperaba 0. result: ${result2}`)
}

// 3
logger.debug("test3: retorna 9 cuando 4 y 5")
totalTests++
const result3 = suma(4, 5)
if (result3 === 9) {
  logger.debug("test3: success")
  testPassed++
} else {
  logger.debug(`test3: fail. Se esperaba 9. result: ${result3}`)
}

// 4
logger.debug("test3: retorna 31 cuando 2, 4, 10 y 15")
totalTests++
const result4 = suma(2, 4, 10, 15)
if (result4 === 31) {
  logger.debug("test4: success")
  testPassed++
} else {
  logger.debug(`test4: fail. Se esperaba 31. result: ${result4}`)
}

logger.debug(`Pasaron ${testPassed} de ${totalTests}`)
