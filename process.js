const { Command } = require("commander")
const logger = require("./logger")

const program = new Command()

program
  .option("-p <port>", "Puerto de escucha", 8080)
  .option("--mode <mode>", "Modo de ejecucion", "production")
  .requiredOption("-u <user>", "Usuario del proceso", null)

program.parse()

logger.info(program.opts())
logger.info(program.args)
