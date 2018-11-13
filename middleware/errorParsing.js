import EventBus from './eventBus';

const codes = Object.freeze({
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
});

export default function (err) {
  switch (err.statusCode) {
    case codes.BadRequest:
      return `Invalid Request!  Server: ${err.error.message}`;
    case codes.Unauthorized:
      EventBus.$emit('logout');
      return `Unauthorized. Please log in.  Server: ${err.error.message}`;
    case codes.NotFound:
      return `The Requested Value was Not Found.  Server: ${err.error.message}`;
    case codes.Conflict:
      return `An Entry like This Already Exists!  Server: ${err.error.message}`;
    case codes.InternalServerError:
      return `The Server is Buggy, and couldn't handle that.  Server: ${err.error.message}`;
    default:
      return `Unknown error.  Server:  ${err.error.message}`;
  }
}
