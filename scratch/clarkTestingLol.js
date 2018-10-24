const winston = require('winston');
const { SimpleCrud } = require('../middleware');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
  exitOnError: false,
});

const host = 'https://localhost:3000';

const AccountCrud = new SimpleCrud(host, '/instructor/account');
const LoginCrud = new SimpleCrud(host, '/instructor/login');

async function simpleTest() {
  try {
    logger.info('Testing account creation');
    let response = await AccountCrud.post({
      username: 'Coleman',
      password: 'colemancs499',
      firstName: 'Professor',
      lastName: 'Coleman',
      email: 'coleman@coleman.col',
    });
    logger.info(JSON.stringify(response, null, 2));
    // logger.info(response.statusCode);

    logger.info('Testing account login');
    response = await LoginCrud.post({
      username: 'Coleman',
      password: 'colemancs499',
    });
    logger.info(JSON.stringify(response, null, 2));
    // logger.info(response.statusCode);

    logger.info('Testing account delete');
    response = await AccountCrud.delete();
    logger.info(JSON.stringify(response, null, 2));
    // logger.info(response.statusCode);
  } catch (err) {
    logger.error(err);
  }
}

simpleTest();
