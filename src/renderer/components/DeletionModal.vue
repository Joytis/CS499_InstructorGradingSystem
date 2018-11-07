<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title"> {{ this.title }} </p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner :animation-duration="1000" :size="200" :color="'#cd5bef'"/>
      </div>
      <div v-else-if="state === 'error'"> {{ error.message }} </div>
      <div v-else-if="state === 'success'"> Success! </div>
      <div v-else> {{ deletionString() }} </div>
    </section>
    <footer class="modal-card-foot">
      <div v-if="state === 'main'">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary" @click="attemptDatabaseDelete">Delete</button>
      </div>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';

export default {
  name: 'DeletionModalForm',
  components: {
    AtomSpinner,
  },
  props: {
    deletionMessage: String,
    title: String,
    target: Object,
    inputs: Object,
  },
  data() {
    return {
      error: undefined,
      state: 'main',
      staged: {},
    };
  },

  created() {
    // Update all our values with the passed args.
    this.staged = this.target;
  },

  methods: {
    deletionString() {
      return (this.deletionMessage !== undefined)
        ? this.deletionMessage
        : 'Are you sure you wish to delete this entry?';
    },
    async attemptDatabaseDelete() {
      try {
        // Display loading
        this.state = 'loading';
        // Wait for term creation
        await this.inputs.crudTarget.delete(this.target.id);
        // wait for two seconds then close window.
        this.state = 'success';

        // if we want to do something afterwards, do it here!
        if (this.inputs.postDelete !== undefined) {
          await this.inputs.postDelete(this.target);
        }
      } catch (err) {
        this.state = 'error';
        this.error = err;
        // DISPLAY ERROR MODAL?
      }
    },
  },

};
</script>

<style>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
