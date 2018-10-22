const request = require('request-promise-native');
const urljoin = require('url-join');

function appendIdIfExists(url, id) {
  // If we're passed an ID, staple it to the request.
  if (id !== undefined) {
    if (!Number.isInteger(Number(id))) throw Error('Invalid arguments');
    return urljoin(url, String(id));
  }
  return url;
}

module.exports = class SimpleCrud {
  constructor(host, route) {
    this.target = urljoin(host, route);

    this.basicRequestOptions = {
      url: this.target,
      json: true,
      jar: true, // enable cached cookies
      resolveWithFullResponse: true, // Ensure we can get the status code of our response
    };
  }

  copyOptions() {
    // Shallow copy should be just fine. We don't have nested object options.
    return Object.assign({}, this.basicRequestOptions);
  }

  async get(id) {
    // Shallow copy should be just fine.
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    return request.get(options);
  }

  // Post a javascript object to our route.
  async post(obj) {
    const options = this.copyOptions();
    options.body = obj;
    return request.post(options);
  }

  // Updates the object with the given ID with values in obj
  async put(id, obj) {
    if (id === undefined) throw new Error('No ID provided');
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    options.body = obj;
    return request.delete(options);
  }

  // For accounts, we sometimes don't want to append the ID.
  async delete(id) {
    const options = this.copyOptions();
    options.url = appendIdIfExists(options.url, id);
    return request.delete(options);
  }
};
