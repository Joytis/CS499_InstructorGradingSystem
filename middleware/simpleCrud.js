/* eslint-disable no-console */
import request from 'request-promise-native';
import urljoin from 'url-join';
import { config } from '../config';

function appendIdIfExists(url, id) {
  // If we're passed an ID, staple it to the request.
  if (id !== undefined) {
    if (!Number.isInteger(Number(id))) throw Error('Invalid arguments');
    return urljoin(url, String(id));
  }
  return url;
}

const cookieJar = request.jar();

export class SimpleCrud {
  constructor(host, route) {
    this.target = urljoin(host, route);

    this.basicRequestOptions = {
      url: this.target,
      json: true,
      jar: cookieJar, // enable cached cookies
      resolveWithFullResponse: true, // Ensure we can get the status code of our response
    };
  }

  copyOptions() {
    // Shallow copy should be just fine. We don't have nested object options.
    return Object.assign({}, this.basicRequestOptions);
  }

  fromAppendedRoute(route) {
    return new SimpleCrud(this.target, route);
  }

  async get(id) {
    // Shallow copy should be just fine.
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    const response = await request.get(options);
    return response.body;
  }

  // Post a javascript object to our route.
  async post(obj) {
    const options = this.copyOptions();
    options.body = obj;
    const response = await request.post(options);
    return response.body;
  }

  // Updates the object with the given ID with values in obj
  async put(id, obj) {
    if (id === undefined) throw new Error('No ID provided');
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    options.body = obj;
    const response = await request.put(options);
    return response.body;
  }

  // For accounts, we sometimes don't want to append the ID.
  async delete(id) {
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    const response = await request.delete(options);
    return response.body;
  }

  // This is only used once. But gat damn am I not inclined to redesign this whole thing.
  //  to work better
  async spicyDelete(body) {
    const options = this.copyOptions();
    options.body = body;
    const response = await request.delete(options);
    return response.body;
  }
}

export const AccountCrud = new SimpleCrud(config.serverHost, '/instructor/account');
export const LoginCrud = new SimpleCrud(config.serverHost, '/instructor/login');
export const LogoutCrud = new SimpleCrud(config.serverHost, '/instructor/logout');
export const CourseCrud = new SimpleCrud(config.serverHost, '/courses');
export const SectionCrud = new SimpleCrud(config.serverHost, '/sections');
export const TermCrud = new SimpleCrud(config.serverHost, '/terms');
export const EnrollmentCrud = new SimpleCrud(config.serverHost, '/enrollment');
export const StudentCrud = new SimpleCrud(config.serverHost, '/students');
export const GradeCrud = new SimpleCrud(config.serverHost, '/grades');
export const AssignmentCrud = new SimpleCrud(config.serverHost, '/assignments');
export const AssignmentCategoryCrud = new SimpleCrud(config.serverHost, '/assignmentCategories');
