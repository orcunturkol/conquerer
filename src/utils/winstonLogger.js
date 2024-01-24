const { createLogger, transports, format } = require("winston");
const { colorize, timestamp, align, printf, combine } = format;

const logger = createLogger({
  transports: [new transports.Console()],
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    align(),
    printf(
      (info) => `[${info.timestamp}] : [${info.level}] - [${info.message}]`
    )
  ),
});
module.exports = logger;
