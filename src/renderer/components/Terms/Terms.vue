<template>
  <section>

    <button class="button is-primary is-small"
      @click="out(selected)">
      Create New Term
    </button>    
    <button class="button is-warning is-small"
      @click="out(selected)"
      :disabled="!selected"
      >
      Edit Term
    </button>

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep" has-modal-card>
      <create-term-modal-form></create-term-modal-form>
    </b-modal>
    
      <b-table
        :data="mockdata"
        paginated
        per-page="8"
        focusable
        :selected.sync="selected"
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
import CreateTermModalForm from './CreateTermModalForm.vue';


export default {
  name: 'TermModal',
  beforeCreate() {
    this.mockdata = data;
  },
  components: {
    CreateTermModalForm,
  },
  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
      selected: null,
    };
  },
  methods: {
    out(args) {
      console.log(args);
    },
  },
};
</script>