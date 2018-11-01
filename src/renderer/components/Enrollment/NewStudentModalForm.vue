<template>
<form action="">
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Create Student</p>
        </header>
        <section class="modal-card-body">
            <b-field label="A-Number">
                <b-input
										type="number"
                    :value="aNumber"
                    placeholder="A########"
                    required>
                </b-input>
            </b-field>
            <b-field label="First Name">
                <b-input
                    :value="firstname"
                    placeholder="First Name"
                    required>
                </b-input>
            </b-field>
						<b-field label="Last Name">
                <b-input
                    :value="lastName"
                    placeholder="Last Name"
                    required>
                </b-input>
            </b-field>
						<b-field label="Email">
                <b-input
										:type="email"
                    :value="email"
                    placeholder="UAH Email"
                    required>
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Cancel</button>
            <button class="button is-primary" @click="$parent.close()">Create</button>
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
      aNumber: '',
      firstName: '',
      lastName: '',
      email: '',
    };
  },
};
</script>
