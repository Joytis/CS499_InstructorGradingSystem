<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Create New Term</p>
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
        <b-field label="Term Name">
          <b-input v-model="term.title" placeholder="Spring '18" required> </b-input>
        </b-field>
        <b-field label="Term Start Date">
          <b-datepicker 
            v-model="term.startDate" 
            placeholder="Select a date (mm/dd/yyyy)" 
            icon="calendar-today" 
            editable 
            required>
          </b-datepicker>
        </b-field>
        <b-field label="Term End Date">
          <b-datepicker 
            v-model="term.endDate" 
            placeholder="Select a date (mm/dd/yyyy)" 
            icon="calendar-today" 
            editable 
            required>
          </b-datepicker>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="attemptTermCreate">Create</button>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { TermCrud } from '../../../../middleware';

export default {
  name: 'CreateTermModalForm',
  components: {
    AtomSpinner,
  },
  props: [],
  data() {
    return {
      error: undefined,
      state: 'main',
      term: {
        title: '',
        startDate: '',
        endDate: '',
      },
    };
  },
  methods: {
    async attemptTermCreate() {
      try {
        // Display loading
        this.state = 'loading';
        // Wait for term creation
        // console.log(this.term.startDate);
        await TermCrud.post(this.term);
        // wait for two seconds then close window.
        this.state = 'success';
        this.$emit('update');
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

<style>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
