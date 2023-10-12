const config = require("../config/config")
const {
  createLogger,
  transports: { Console, File },
  format: { combine, colorize, simple },
} = require("winston")

const options = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "blue",
    debug: "white",
  },
}

const logger = createLogger({
  transports: [
    new Console({
      level: config.CONSOLE_LOG_LEVEL,
      format: combine(colorize({ colors: options.colors }), simple()),
    }),
    new File({
      filename: "./logs/errors.log",
      level: config.FILE_LOG_LEVEL,
      format: simple(),
    }),
  ],
})

module.exports = logger
