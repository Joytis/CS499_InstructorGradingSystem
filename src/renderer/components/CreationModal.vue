<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title"> {{ this.title }} </p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner :animation-duration="1000" :size="200" :color="'#cd5bef'"/>
      </div>
      <div v-else-if="state === 'error'">
        <div> {{ error.message }} </div>
      </div>
      <div v-else-if="state === 'success'">
        Success!
      </div>
      <div v-else v-for="(field, key) in inputs.templates">
        <b-field :label="field.label">
          <div v-if="field.type === 'input'">
            <b-input v-model="staged[key]" :type="field.subtype" :placeholder="field.placeholder" required/>
          </div>
          <div v-else-if="field.type === 'datepicker'">
            <b-datepicker
              v-model="staged[key]"
              :placeholder="field.placeholder"
              icon="calendar-today" 
              editable 
              required />
          </div>
          <div v-else-if="field.type === 'password'">
            <b-input 
              type="password" 
              v-model="staged[key]" 
              password-reveal 
              :placeholder="field.placeholder" 
              required/>
          </div>
          <div v-else>
            NO VALID TYPE GIVEN
          </div>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary"v-text="primaryButtonText()" @click="attemptDatabaseCreate"/>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';

export default {
  name: 'CreationModalForm',
  components: {
    AtomSpinner,
  },
  props: {
    title: String,
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
    Object.keys(this.inputs.templates).forEach((key) => { this.staged[key] = ''; });
  },

  methods: {
    primaryButtonText() {
      return ((this.inputs.primaryText !== undefined) ? this.inputs.primaryText : 'Create');
    },

    async attemptDatabaseCreate() {
      try {
        // If we have a preCreate defined, mutate staged with its staged.
        if (this.inputs.preCreate !== undefined) {
          this.staged = await this.inputs.preCreate(this.staged);
        }

        // Display loading
        this.state = 'loading';
        // Wait for term creation
        const result = (await this.inputs.crudTarget.post(this.staged)).data;
        // wait for two seconds then close window.
        this.state = 'success';

        // if we want to do something afterwards, do it here!
        if (this.inputs.postCreate !== undefined) {
          await this.inputs.postCreate(result);
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