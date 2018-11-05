<template>
  <section>

    <button class="button is-primary is-medium" @click="modalForm = 'signin'; isModalActive = true">
      Sign In
    </button>

    <button class="button is-primary is-medium" @click="modalForm = 'signup'; isModalActive = true">
      Sign Up
    </button>


    <button class="button is-primary is-Small" @click="testMean"> 1 </button>
    <button class="button is-primary is-Small" @click="testMedian"> 2 </button>
    <button class="button is-primary is-Small" @click="testMode"> 3 </button>
    <button class="button is-primary is-Small" @click="testSD"> 4 </button>

    <b-modal :active.sync="isModalActive" has-modal-card>
      <creation-modal-form v-if="modalForm === 'signin'" :inputs="signInModalInputs"/>
      <creation-modal-form v-else-if="modalForm === 'signup'" :inputs="signUpModalInputs"/>
    </b-modal>
  </section>
</template>
  
<script>
/* eslint-disable no-alert */
import CreationModalForm from '../CreationModal.vue';
import { AccountCrud, LoginCrud, QuickMaffs } from '../../../../middleware';


export default {
  name: 'AuthModal',
  components: {
    CreationModalForm,
  },
  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
      signUpModalInputs: {
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
        primaryText: 'Sign In',
        templates: {
          username: { label: 'Username', type: 'input', placeholder: '' },
          password: { label: 'Password', type: 'password', placeholder: 'password' },
        },
      },
    };
  },
  methods: {
    testMean() { alert(QuickMaffs.Mean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); },
    testMedian() { alert(QuickMaffs.Median([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); },
    testMode() { alert(QuickMaffs.Mode([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); },
    testSD() { alert(QuickMaffs.StandardDeviation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); },

  },
};
</script>

]