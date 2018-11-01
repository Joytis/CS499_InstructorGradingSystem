import request from 'request';
import winston from 'winston';

const host = 'https://localhost:3000';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
  exitOnError: false,
});

async function getInstructor() {
  // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function postInstructor(args) {
  // Post request
  try {
    const data = {
      // Test if variable argument is passed into info and outputted from test file. May be removed
      Instructor: 'Instructor',
    };
    const info = await request.post(`${host}/auth/instructors`, args);
    logger.info(JSON.stringify(data, null, 2));
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function getAccount() {
  // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function postAccount(args) {
  // Post request
  try {
    const data = {
      // Test if variable argument is passed into info and outputted from test file. May be removed
      Account: 'Account',
    };
    const info = await request.post(`${host}/auth/instructors`, args);
    logger.info(JSON.stringify(data, null, 2));
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function getLogin() {
  // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function postLogin(args) {
  // Post request
  try {
    const data = {
      // Test if variable argument is passed into info and outputted from test file. May be removed
      Login: 'Login',
    };
    const info = await request.post(`${host}/auth/instructors`, args);
    logger.info(JSON.stringify(data, null, 2));
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function getLogout() {
  // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  } catch (error) {
    throw error(error);
  }
}

async function postLogout(args) {
  // Post request
  try {
    const data = {
      // Test if variable argument is passed into info and outputted from test file. May be removed
      Logout: 'Logout',
    };
    const info = await request.post(`${host}/auth/instructors`, args);
    logger.info(JSON.stringify(data, null, 2));
    return info;
  } catch (error) {
    throw error(error);
  }
}

module.exports = {
  getInstructor,
  postInstructor,
  getAccount,
  postAccount,
  getLogin,
  postLogin,
  getLogout,
  postLogout,
};
