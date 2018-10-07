<template>
  <section>

    <button class="button is-primary is-medium"
      @click="isComponentModalActive = true">
      Sign In
    </button>

    <button class="button is-primary is-medium"
      @click="isComponentModalActive = true">
      Sign Up
    </button>

    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <sign-in-form></sign-in-form>
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
      isComponentModalActive: false,
    };
  },
  methods: {},
};
</script>

]