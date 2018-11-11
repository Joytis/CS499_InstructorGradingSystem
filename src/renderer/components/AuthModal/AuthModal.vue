<template>
  <section>

    <button class="button is-primary is-medium" @click="modalForm = 'signin'; isModalActive = true">
      Sign In
    </button>

    <button class="button is-primary is-medium" @click="modalForm = 'signup'; isModalActive = true">
      Sign Up
    </button>

    <b-modal :active.sync="isModalActive" has-modal-card>
      <creation-modal-form v-if="modalForm === 'signin'" :inputs="signInModalInputs"/>
      <creation-modal-form v-else-if="modalForm === 'signup'" :inputs="signUpModalInputs"/>
    </b-modal>
  </section>
</template>
  
<script>
/* eslint-disable no-alert */
import CreationModalForm from '../CreationModal.vue';
import InstructorModalInputs from '../InstructorModalInputs';


export default {
  name: 'AuthModal',
  components: {
    CreationModalForm,
  },
  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
      signUpModalInputs: InstructorModalInputs.instructorModalInputs,
      signInModalInputs: InstructorModalInputs.signInModalInputs,
    };
  },
  methods: {},
};
</script>

]