<template>
  <form action="">
    <div v-if="state === 'loading'" class="modal-card" style="width: auto">
      <cube-spin></cube-spin>
    </div>
    <div v-else-if="state === 'error'" class="modal-card" style="width: auto">
      Error!
    </div>
    <div v-else-if="state === 'success'" class="modal-card" style="width: auto">
      Success!
    </div>
    <div v-else class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Sign Up</p>
      </header>
      <section class="modal-card-body">
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
      </section>
      <footer class="modal-card-foot">
          <button class="button" type="button" @click="$emit('swap', 'signin')">Toggle</button>
          <button class="button is-primary" @click="attemptAccountCreate">Sign Up</button>
      </footer>
    </div>
  </form>
</template>

<script>
/* eslint-disable no-console */
import { CubeSpin } from 'vue-loading-spinner';
import { config } from '../../../../config';
import { SimpleCrud, Timeout } from '../../../../middleware';

export default {
  components: {
    CubeSpin,
  },
  props: [],
  data() {
    return {
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

  beforeCreate() {
    this.AccountCrud = new SimpleCrud(config.serverHost, '/instructor/account');
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
        await Timeout(2000);

        this.parent.close();
      } catch (err) {
        console.error(err);
        this.state = 'error';
        // DISPLAY ERROR MODAL?
      }
    },
  },
};
</script>
