<template>
  <section>

    <button class="button is-primary is-small"
      @click="isModalActive = true">
      Create New Student
    </button>    
    <button class="button is-warning is-small"
      @click="out(selected)"
      :disabled="checkedRows.length!=1"
      >
      Edit Student
    </button>
    <button class="button is-success is-small"
      :disabled="checkedRows.length==0"
    >
      Add To Section
    </button>

    <b-input v-model="searchString"
      placeholder="Filter Results..."
      style="padding-top: .3em;"
    ></b-input>

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep" has-modal-card>
      <create-term-modal-form></create-term-modal-form>
    </b-modal>
    
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
    <b-modal :active.sync="isModalActive" has-modal-card>
      <modal-form></modal-form>
    </b-modal>
  </section>
</template>


<script>
/* eslint-disable no-console */
import data from './TermListDataMock';
import modalForm from './NewStudentModalForm.vue';


export default {
  name: 'GlobalEnrollment',
  mounted() {
    this.data = data;
  },
  components: {
    modalForm,
  },
  data() {
    return {
      isModalActive: false,
      checkedRows: [],
      data: [],
      searchString: '',
    };
  },
  methods: {
    out(args) {
      console.log(args);
    },
  },
  computed: {
    filteredData() {
      return this.data.filter((student) => (
        student.email.toLowerCase().includes(this.searchString.toLowerCase())
        || student.firstName.toLowerCase().includes(this.searchString.toLowerCase())
        || student.lastName.toLowerCase().includes(this.searchString.toLowerCase())
        || student.aNumber.toString().includes(this.searchString.toLowerCase())));
    },
  },
};
</script>