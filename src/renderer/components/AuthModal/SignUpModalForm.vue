<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Sign Up</p>
      </header>
      <section class="modal-card-body">
        <div v-if="state === 'loading'">
          <atom-spinner
              :animation-duration="1000"
              :size="200"
              :color="'#cd5bef'"
           />
        </div>
        <div v-else-if="state === 'error'">
          <div> {{ error.message }} </div>
        </div>
        <div v-else-if="state === 'success'">
          Success!
        </div>
        <div v-else>
          <b-field label="Username">
            <b-input v-model="account.username" placeholder="" required/>
          </b-field>

          <b-field label="First Name"> 
            <b-input v-model="account.firstName" placeholder="Jon" required/>
          </b-field>

          <b-field label="Last Name">
            <b-input v-model="account.lastName" placeholder="Smith" required/>
          </b-field>

          <b-field label="Email">
            <b-input type="email" v-model="account.email" placeholder="email@uah.edu" required/>
          </b-field>

          <b-field label="Password">
            <b-input type="password" v-model="account.password" password-reveal placeholder="password" required/>
          </b-field>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$emit('modalSwap', 'signin')">Toggle</button>
        <button class="button is-primary" @click="attemptAccountCreate">Sign Up</button>
      </footer>
    </div>
  </form>
</template>

<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { config } from '../../../../config';
import { SimpleCrud } from '../../../../middleware';

export default {
  components: {
    AtomSpinner,
  },

  beforeCreate() {
    this.AccountCrud = new SimpleCrud(config.serverHost, '/instructor/account');
  },

  data() {
    return {
      error: undefined,
      state: 'main',
      account: {
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      },
    };
  },


  methods: {
    async attemptAccountCreate() {
      try {
        // Display loading
        this.state = 'loading';
        // Wait for account creation
        await this.AccountCrud.post(this.account);
        // wait for two seconds then close window.
        this.state = 'success';
      } catch (err) {
        console.error(err);
        this.state = 'error';
        this.error = err;
        // DISPLAY ERROR MODAL?
      }
    },
  },
};
</script>
