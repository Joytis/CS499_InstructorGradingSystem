<template>
  <section>

    <button class="button is-primary is-medium"
      @click="modalForm = 'signin'; isModalActive = true">
      Sign In
    </button>

    <button class="button is-primary is-medium"
      @click="modalForm = 'signup'; isModalActive = true">
      Sign Up
    </button>

    <b-modal :active.sync="isModalActive" has-modal-card>
      <sign-in-form v-if="modalForm=='signin'" @swap="modalForm=$event"></sign-in-form>
      <sign-up-form v-if="modalForm=='signup'" @swap="modalForm=$event"></sign-up-form>
    </b-modal>
  </section>
</template>
  
<script>
import SignInForm from './SignInModalForm.vue';
import SignUpForm from './SignUpModalForm.vue';


export default {
  name: 'ContentBodyMock',
  components: {
    SignInForm,
    SignUpForm,
  },
  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
    };
  },
  methods: {},
};
</script>

]