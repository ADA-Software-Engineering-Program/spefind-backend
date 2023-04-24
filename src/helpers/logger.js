const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, printf } = format;
const path = require('path');

const myFormat = printf(({ level, label, message, timestamp }) => {
  return `${timestamp} [${level}] ${label} ${message}`;
});

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const options = {
  file: {
    level: 'info',
    filename: path.join('logs', 'app-logs.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

const logger = createLogger({
  level: 'info',
  format: combine(
    enumerateErrorFormat(),
    format.colorize(),
    label({ label: 'Response =>' }),
    timestamp({ format: 'HH:mm:ss' }),
    myFormat
  ),
  transports: [
    new transports.Console(options.console),
    // new transports.File(options.file),
  ],
  exitOnError: false,
});

module.exports = logger;
