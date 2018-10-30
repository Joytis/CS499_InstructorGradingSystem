<template>
  <form action="">
      <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
              <p class="modal-card-title">Login</p>
          </header>
          <section class="modal-card-body">
              <b-field label="Email">
                  <b-input
                      type="email"
                      :value="email"
                      placeholder="uah@email.com"
                      required>
                  </b-input>
              </b-field>

              <b-field label="Password">
                  <b-input
                      type="password"
                      :value="password"
                      password-reveal
                      placeholder="password"
                      required>
                  </b-input>
              </b-field>

          </section>
          <footer class="modal-card-foot">
              <button class="button" type="button" @click="$emit('swap', 'signup')">Toggle</button>
              <button class="button is-primary" @click="$parent.close()">Login</button>
          </footer>
      </div>
  </form>
</template>



<script>
export default {
  components: {
  },
  props: [],
  data() {
    return {
      email: '',
      password: '',
    };
  },
};
</script>
