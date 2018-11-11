import { AccountCrud, LoginCrud, EventBus } from '../../../middleware';

export default {
  instructorModalInputs: {
    crudTarget: AccountCrud,
    templates: {
      username: { label: 'Username', type: 'input', placeholder: '' },
      firstName: { label: 'First Name', type: 'input', placeholder: 'Jon' },
      lastName: { label: 'Last Name', type: 'input', placeholder: 'Smith' },
      email: {
        label: 'Last Name',
        type: 'input',
        subtype: 'email',
        placeholder: 'email@uah.edu',
      },
      password: { label: 'Password', type: 'password', placeholder: 'password' },
    },
  },
  signInModalInputs: {
    crudTarget: LoginCrud,
    postCreate(result) { EventBus.$emit('login', result); },
    primaryText: 'Sign In',
    templates: {
      username: { label: 'Username', type: 'input', placeholder: '' },
      password: { label: 'Password', type: 'password', placeholder: 'password' },
    },
  },
};
