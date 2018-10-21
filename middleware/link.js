const request = require('request');

const host = 'https://localhost:3000';

const data = {
   postInstructor: 'instructor',
 };

/* module.exports = async (err) => {
  const accounts = await request.get(`${host}/instructor/accounts`);
  console.log(accounts);
  if (err) {
    throw err;
  }
}; */

/* module.exports = async (newInstructors) => {
  const newInstructor = await request.post(`${host}/instructor/accounts`, newInstructors);
  console.log(newInstructor);
}; */

async function getInstructor() { // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function postInstructor(args) { // Post request
  try {
    const info = await request.post(`${host}/auth/instructors`, args);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function getAccount() { // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function postAccount(args) { // Post request
  try {
    const info = await request.post(`${host}/auth/instructors`, args);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function getLogin() { // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function postLogin(args) { // Post request
  try {
    const info = await request.post(`${host}/auth/instructors`, args);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function getLogout() { // Get request
  try {
    const info = await request.get(`${host}/instructor/accounts/`);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

async function postLogout(args) { // Post request
  try {
    const info = await request.post(`${host}/auth/instructors`, args);
    return info;
  }
  catch (error) {
    throw error(error);
  }
}

/* Requires courseId argument
async function getCourse(courseId) { // Get request
  const info = await request.get(`${host}/course/${courseId}`);
  if (!info) { // Return error if get post request fails
    throw new Error('Error');
  }
  return info;
} */

export default {
  getInstructor,
  postInstructor,
  getAccount,
  postAccount,
  getLogin,
  postLogin,
  getLogout,
  postLogout,
};
