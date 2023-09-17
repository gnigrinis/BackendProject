const { Command } = require("commander");

const program = new Command();

program
  .option("-p <port>", "Puerto de escucha", 8080)
  .option("--mode <mode>", "Modo de ejecucion", "production")
  .requiredOption("-u <user>", "Usuario del proceso", null);

program.parse();

console.log(program.opts());
console.log(program.args);
