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
            <b-input 
              v-model="staged[key]" 
              :type="field.subtype" 
              :step="field.step || 1" 
              :min="field.min || 0" 
              :max="field.max || Number.MAX_SAFE_INTEGER"
              :placeholder="(field.placeholder) ? field.placeholder : ''" 
              required/>
          </div>
          <div v-else-if="field.type === 'datepicker'">
            <b-datepicker
              v-model="staged[key]"
              :placeholder="field.placeholder"
              icon="calendar-today" 
              editable 
              inline
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
          <div v-else-if="field.type === 'dropdown'">
            <b-select v-model="staged[key]" placeholder="Select an option" required>
              <option v-for="option in field.getData()"
                      :value="option[field.value]"
                      :key="option[field.key]"
              >
                {{ field.display(option) }}
              </option>
            </b-select>
          </div>
          <div v-else-if="field.type === 'filteredDropdown'">
            <b-input v-model="searchString"
              placeholder="Filter Results..."
              style="padding-top: .3em;"
            ></b-input>
            <b-select v-model="staged[key]" placeholder="Select an option" required>
              <option v-for="option in filteredData(field.getData())"
                      :value="option[field.value]"
                      :key="option[field.key]"
              >
                {{ field.display(option) }}
              </option>
            </b-select>
          </div>
          <div v-else-if="field.type === 'filteredTable'">
            <b-input v-model="searchString"
              placeholder="Filter Results..."
              style="padding-top: .3em;"
            ></b-input>
            <b-table
              :data="filteredData(field.getData())"
              paginated
              per-page="8"
              checkable=""
              :checked-rows.sync="checkedRows"
            >
              <template slot-scope="props">
                <b-table-column field="firstName" label="First Name" sortable>
                  {{ props.row.firstName }}
                </b-table-column>
                <b-table-column field="lastName" label="Last Name" sortable>
                  {{ props.row.lastName }}
                </b-table-column>
              </template>
            </b-table>
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
        <button class="button is-primary" v-text="primaryButtonText()" @click="attemptDatabaseCreate"/>
      </div>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { ParseError } from '../../../middleware';

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
      searchString: '',
      checkRows: [],
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
        console.log(err);
        this.error = ParseError(err);
        // DISPLAY ERROR MODAL?
      }
    },
    filteredData(allStudents) {
      return allStudents.filter((student) => (
        student.firstName.toLowerCase().includes(this.searchString.toLowerCase())
        || student.lastName.toLowerCase().includes(this.searchString.toLowerCase())));
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
