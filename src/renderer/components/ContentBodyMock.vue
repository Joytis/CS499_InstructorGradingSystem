<template>
  <section>

    <button class="button is-primary is-medium"
      @click="isSignInModalActive = true">
      Sign In
    </button>

    <button class="button is-primary is-medium"
      @click="isSignUpModalActive = true">
      Sign Up
    </button>

    <b-modal :active.sync="isSignInModalActive" has-modal-card>
      <sign-in-form></sign-in-form>
    </b-modal>

    <b-modal :active.sync="isSignUpModalActive" has-modal-card>
      <sign-up-form></sign-up-form>
    </b-modal>
  </section>
</template>
  
<script>
import SignInForm from './AuthModal/SignInModal.vue';
import SignUpForm from './AuthModal/SignUpModal.vue';


export default {
  name: 'ContentBodyMock',
  components: {
    SignInForm,
    SignUpForm,
  },
  data() {
    return {
      isSignInModalActive: false,
      isSignUpModalActive: false,
    };
  },
  methods: {},
};
</script>

]