<template>
  <section class="section">
    <navbar-login></navbar-login>
    <div class="columns">
      <div class="column is-half primary">
        <div class="logo">
          <img src="../../../../static/gbpp_logo.png" width="200" height="auto">
          <div>Gradebook++</div>
        </div>
      </div>
      <div class="column is-half login-buttons">
        <button class="button is-primary is-large" @click="modalForm = 'signin'; isModalActive = true">
          Sign In
        </button>

        <button class="button is-primary is-large" @click="modalForm = 'signup'; isModalActive = true">
          Sign Up
        </button>

        <b-modal :active.sync="isModalActive" has-modal-card>
          <creation-modal-form v-if="modalForm === 'signin'" :inputs="signInModalInputs"/>
          <creation-modal-form v-else-if="modalForm === 'signup'" :inputs="signUpModalInputs"/>
        </b-modal>
      </div>
    </div>
  </section>
</template>
  
<script>
/* eslint-disable no-alert */
import CreationModalForm from '../CreationModal.vue';
import InstructorModalInputs from '../InstructorModalInputs';
import NavbarLogin from '../NavbarLogin.vue';

export default {
  name: 'AuthModal',
  components: {
    CreationModalForm,
    NavbarLogin,
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
</script>/

<style lang="scss">
@import "../../App";

.primary {
  background-color: nth(map-get($colors, primary), 1);
  height: 80vh;
  margin-top: 8vh;
  overflow: hidden;
}

.login-buttons {
  text-align: center;
  margin-top: 60vh;
}

.logo {
  color: white;
  font-size: 5em;
  text-align: center;
  margin-top: 15vh;
}

</style>


