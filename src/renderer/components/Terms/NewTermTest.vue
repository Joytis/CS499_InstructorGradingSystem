<template>
  <section>

    <button class="button is-primary is-small"
      @click="isModalActive = true">
      Create New Term
    </button>

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep" has-modal-card>
      <create-term-modal-form></create-term-modal-form>
    </b-modal>
  </section>
</template>
  
<script>
import CreateTermModalForm from './CreateTermModalForm.vue';


export default {
  name: 'TermModal',
  components: {
    CreateTermModalForm,
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