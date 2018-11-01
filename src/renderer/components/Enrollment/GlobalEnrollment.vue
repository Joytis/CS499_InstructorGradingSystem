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

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep" has-modal-card>
      <create-term-modal-form></create-term-modal-form>
    </b-modal>
    
      <b-table
        :data="mockdata"
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
  beforeCreate() {
    this.mockdata = data;
  },
  components: {
    modalForm,
  },
  data() {
    return {
      isModalActive: false,
      checkedRows: [],
      data: [],
      searchString: 'something',
    };
  },
  methods: {
    out(args) {
      console.log(args);
    },
  },
  computed: {
    filteredData() {
      return this.data.filter((student) => (student.email.includes(this.searchString)
        || student.firstName.includes(this.searchString)
        || student.lastName.includes(this.searchString)
        || student.aNumber.toString().includes(this.searchString)));
    },
  },
};
</script>