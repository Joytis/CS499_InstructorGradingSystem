const request = require('request');

const host = 'https://localhost:3000';

// const data = {
//   username: 'username',
//   password: 'password',
//   confirmPassword: 'password',
//   firstName: 'firstname',
//   lastName: 'lastname',
//   email: 'email@email.com',
// };

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
  const info = await request.get(`${host}/instructor/accounts/`);
  if (!info) { // Return error if get request fails
    throw new Error('Error');
  }
  return info;
}

async function postInstructor() { // Post request
  const info = await request.post(`${host}/auth/instructors`);
  if (!info) { // Return error if post request fails
    throw new Error('Error');
  }
  return info;
}

async function getAccount() {
  const info = await request.get(`${host}/instructors/accounts`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
}

async function postAccount() {
  const info = await request.post(`${host}/auth/instructors`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
}
async function getLogin() {
  const info = await request.get(`${host}/instructors/accounts`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
}

async function postLogin() {
  const info = await request.post(`${host}/auth/instructors`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
}

async function getLogout() {
  const info = await request.get(`${host}/instructors/accounts`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
}

async function postLogout() {
  const info = await request.post(`${host}/auth/instructors`);
  if (!info) {
    throw new Error('Error');
  }
  return info;
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
