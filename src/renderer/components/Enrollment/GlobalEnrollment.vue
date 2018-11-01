<template>
  <section>

    <button class="button is-primary is-small"
      @click="out(selected)">
      Create New Term
    </button>    
    <button class="button is-warning is-small"
      @click="out(selected)"
      :disabled="checkedRows.length!=1"
      >
      Edit Term
    </button>
    <button class="button is-success is-small"
      :disabled="checkedRows.length"
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
          <b-table-column field="startDate" label="Start Date" sortable>
            {{ props.row.startDate }}
          </b-table-column>
          <b-table-column field="endDate" label="End Date" numeric>
            {{ props.row.endDate }}
          </b-table-column>
          <b-table-column field="title" label="Term Name" width="180" sortable>
            {{ props.row.title }}
          </b-table-column>
        </template>
      </b-table>
  </section>
</template>


<script>
/* eslint-disable no-console */
import data from './TermListDataMock';


export default {
  name: 'GlobalEnrollment',
  beforeCreate() {
    this.mockdata = data;
  },
  components: {},
  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
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