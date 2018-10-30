<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Login</p>
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
          <b-input 
            v-model="account.username" 
            placeholder="" 
            required/>
        </b-field>

        <b-field label="Password">
          <b-input type="password" 
            v-model="account.password" 
            password-reveal 
            placeholder="password" 
            required/>
        </b-field>
      </div>

    </section>
    <footer class="modal-card-foot">
        <button class="button" type="button" @click="$emit('modalSwap', 'signup')">Toggle</button>
        <button class="button is-primary" @click="attemptAccountLogin">Login</button>
    </footer>
  </div>
</template>


<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { LoginCrud } from '../../../../middleware';

export default {
  components: {
    AtomSpinner,
  },
  data() {
    return {
      error: undefined,
      state: 'main',
      account: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async attemptAccountLogin() {
      try {
        // Display loading
        this.state = 'loading';
        // Wait for account creation
        await LoginCrud.post(this.account);
        // wait for two seconds then close window.
        this.state = 'success';
      } catch (err) {
        console.error(err);
        this.state = 'error';
        this.error = err;
      }
    },
  },
};
</script>
