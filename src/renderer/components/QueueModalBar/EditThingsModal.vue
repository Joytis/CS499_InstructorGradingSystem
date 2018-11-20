<template>
  <div class="modal-card crud-modal" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title"> {{ this.title }} </p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner :animation-duration="1000" :size="200" :color="'#cd5bef'"/>
      </div>
      <div v-else-if="state === 'error'">
        <div> {{ error }} </div>
      </div>
      <div v-else-if="state === 'success'">
        Success!
      </div>
      <div v-else v-for="(field, key) in inputs.templates" :key="field.label">
        <b-field :label="field.label">
          <div v-if="field.type === 'input'">
            <b-input v-model="staged[key]" :type="field.subtype" required/>
          </div>
          <div v-else-if="field.type === 'datepicker'">
            <b-datepicker v-model="staged[key]" icon="calendar-today" editable inline required/>
          </div>
          <div v-else-if="field.type === 'password'">
            <b-input type="password" v-model="staged[key]" password-reveal required/>
          </div>
          <div v-else-if="field.type === 'dropdown'">
            <b-select v-model="staged[key]" placeholder="Select an option" required>
              <option v-for="option in field.getData()"
                      :value="option[field.value]"
                      :key="option[field.key]"
              >
                {{ option.name }}
              </option>
            </b-select>
          </div>
          <div v-else>
            NO VALID TYPE GIVEN
          </div>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div v-if="state === 'main'">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-warning" v-text="primaryButtonText()" @click="emit()"/>
      </div>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { ParseError } from '../../../../middleware';

export default {
  name: 'EditThingsModalForm',
  components: {
    AtomSpinner,
  },
  props: {
    title: String,
    target: Object,
    inputs: Object,
    editMethod: Function,
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
    emit() {
      this.$emit('returnEvent', this.staged);
      this.$parent.close();
    },
    primaryButtonText() {
      return ((this.inputs.primaryText !== undefined) ? this.inputs.primaryText : 'Update');
    },
    async attemptDatabaseCreate() {
      try {
        // If we have a preUpdate defined, mutate staged with its staged.
        if (this.inputs.preUpdate !== undefined) {
          this.staged = await this.inputs.preUpdate(this.staged);
        }

        // Display loading
        this.state = 'loading';
        // Wait for term creation
        await this.inputs.crudTarget.put(this.target.id, { data: this.staged });
        // wait for two seconds then close window.
        this.state = 'success';

        // if we want to do something afterwards, do it here!
        if (this.inputs.postUpdate !== undefined) {
          await this.inputs.postUpdate(this.staged);
        }
      } catch (err) {
        this.state = 'error';
        this.error = ParseError(err);
        // DISPLAY ERROR MODAL?
      }
    },
  },

};
</script>

<style>
.crud-modal {
  color: black;
}

.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
