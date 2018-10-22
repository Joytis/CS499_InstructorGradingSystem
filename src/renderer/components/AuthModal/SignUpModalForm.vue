<template>
            <form action="">
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Sign Up</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="First Name">
                            <b-input
                                :value="FirstName"
                                placeholder="Jon"
                                required>
                            </b-input>
                        </b-field>
                        <b-field label="Last Name">
                            <b-input
                                :value="LastName"
                                placeholder="Smith"
                                required>
                            </b-input>
                        </b-field>
                        <b-field label="Email">
                            <b-input
                                type="email"
                                :value="email"
                                placeholder="email@uah.edu"
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
                        <button class="button" type="button" @click="$emit('swap', 'signin')">Toggle</button>
                        <button class="button is-primary" @click="$parent.close()">Sign Up</button>
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
      FirstName: '',
      LastName: '',
    };
  },
};
</script>
