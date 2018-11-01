<template>
  <section>

    <button class="button is-primary is-small"
      @click="isModalActive = true">
      Create New Term
    </button>    
    <button class="button is-warning is-small"
      @click="out(selected)"
      :disabled="!selected"
      >
      Edit Term
    </button>

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep" has-modal-card>
      <create-term-modal-form @update="fetchData"></create-term-modal-form>
    </b-modal>
    
    <b-table
      :data="terms"
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
import { TermCrud } from '../../../../middleware';
import CreateTermModalForm from './CreateTermModalForm.vue';


export default {
  name: 'Term',

  created() {
    this.fetchData();
  },

  components: {
    CreateTermModalForm,
  },

  data() {
    return {
      isModalActive: false,
      modalForm: 'signup',
      selected: null,
      terms: [],
    };
  },
  methods: {
    out: console.log,

    async fetchData() {
      this.terms = (await TermCrud.get()).data;
    },
  },
};
</script>