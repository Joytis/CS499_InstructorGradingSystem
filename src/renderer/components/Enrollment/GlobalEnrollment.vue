<template>
  <section>

    <button class="button is-primary is-small" @click="isModalActive = true"> 
      Create New Student
    </button>    
    <button class="button is-warning is-small" 
      @click="isEditThingsModalActive = true" 
      :disabled="checkedRows.length != 1">
      Edit Student
    </button>
    <button class="button is-success is-small" :disabled="checkedRows.length==0">
      Add To Section
    </button>

    <b-modal :active.sync="isCreationModalActive" :width="640" scroll="keep" has-modal-card>
      <creation-modal-form :inputs="studentModalInputs"></creation-modal-form>
    </b-modal>
    <b-modal :active.sync="isEditThingsModalActive" :width="640" scroll="keep" has-modal-card>
      <edit-things-modal-form :inputs="studentModalInputs" :target="checkedRows[0]"></edit-things-modal-form>
    </b-modal>

    <b-input v-model="searchString"
      placeholder="Filter Results..."
      style="padding-top: .3em;"
    ></b-input>
    
    <b-table
      :data="filteredData"
      paginated
      per-page="8"
      checkable=""
      :checked-rows.sync="checkedRows"
    >
      <template slot-scope="props">
        <b-table-column field="aNumber" label="A-Number" sortable >
          {{ props.row.aNumber }}
        </b-table-column>
        <b-table-column field="firstName" label="First Name" sortable>
          {{ props.row.firstName }}
        </b-table-column>
        <b-table-column field="lastName" label="Last Name" sortable>
          {{ props.row.lastName }}
        </b-table-column>
        <b-table-column field="email" label="Email" sortable>
          {{ props.row.email }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>


<script>
/* eslint-disable no-console */
// import data from './TermListDataMock';
import CreationModalForm from '../CreationModal.vue';
import EditThingsModalForm from '../EditThingsModal.vue';
import { StudentCrud, EventBus } from '../../../../middleware';

export default {
  name: 'GlobalEnrollment',

  components: {
    CreationModalForm,
    EditThingsModalForm,
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      checkedRows: [],
      students: [],
      searchString: '',
      studentModalInputs: {
        crudTarget: StudentCrud,
        postCreate(student) { EventBus.$emit('student-added', student); },
        templates: {
          aNumber: {
            label: 'A-Number', type: 'input', subtype: 'number', placeholder: 'A########',
          },
          firstName: { label: 'First Name', type: 'input', placeholder: 'First Name' },
          lastName: { label: 'Last Name', type: 'input', placeholder: 'Last Name' },
          email: {
            label: 'Email', type: 'input', subtype: 'email', placeholder: 'UAH Email',
          },
        },
      },
    };
  },
  methods: {
    out(args) {
      console.log(args);
    },

    async fetchData() {
      this.students = (await StudentCrud.get()).data;
    },

    studentAdded(student) { this.students.push(student); },
    studentRemoved(student) { this.students = this.students.filter(s => s.id !== student.id); },
    studentUpdated(student) {
      this.students[this.students.findIndex(s => s.id === student.id)] = student;
    },
  },

  created() {
    this.fetchData();

    EventBus.$on('student-added', this.studentAdded);
    EventBus.$on('student-removed', this.studentRemoved);
    EventBus.$on('student-updated', this.studentUpdated);
  },
  beforeDestroy() {
    EventBus.$off('student-added', this.studentAdded);
    EventBus.$off('student-removed', this.studentRemoved);
    EventBus.$off('student-updated', this.studentUpdated);
  },

  computed: {
    filteredData() {
      return this.students.filter((student) => (
        student.email.toLowerCase().includes(this.searchString.toLowerCase())
        || student.firstName.toLowerCase().includes(this.searchString.toLowerCase())
        || student.lastName.toLowerCase().includes(this.searchString.toLowerCase())
        || student.aNumber.toString().includes(this.searchString.toLowerCase())));
    },
  },
};
</script>