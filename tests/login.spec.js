const login = require("./login")
const logger = require("../logger")

let totalTests = 0
let testPassed = 0

logger.debug("Test1: log no password")
totalTests++

let result1 = null
const console = (msg) => {
  result1 = msg
  logger.debug(msg)
}

login("lalo", "", console)

if (result1 === "no password") {
  logger.debug("test1: success")
  testPassed++
} else {
  logger.debug(`test1: fail. Se esperaba 'no password'. result: ${result1}`)
}

logger.debug(`Pasaron ${testPassed} de ${totalTests}`)
