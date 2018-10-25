import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ level: 'error', filename: './logs/error.log' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

export default logger;
