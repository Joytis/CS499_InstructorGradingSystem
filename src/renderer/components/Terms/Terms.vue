<template>
  <section>
    <crud-modal-bar
      createTitle="Create Term"
      editTitle="Edit Term"
      deleteTitle="Delete Term"
      :target="selected"
      :inputs="modalInputs"
    />
    
    <b-table
      :data="terms"
      paginated
      per-page="8"
      focusable
      :selected.sync="selected"
    >
      <template slot-scope="props">
        <b-table-column field="startDate" label="Start Date" sortable>
          {{ new Date(props.row.startDate).toLocaleDateString() }}
        </b-table-column>
        <b-table-column field="endDate" label="End Date" numeric>
          {{ new Date(props.row.endDate).toLocaleDateString() }}
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
/* eslint-disable no-param-reassign */
import CrudModalBar from '../CrudModalBar.vue';
import { TermCrud, EventBus } from '../../../../middleware';

function parseDates(term) {
  term.startDate = new Date(Date.parse(term.startDate));
  term.endDate = new Date(Date.parse(term.endDate));
}

export default {
  name: 'Term',

  created() {
    this.fetchData();

    EventBus.$on('term-added', this.termAdded);
    EventBus.$on('term-removed', this.termRemoved);
    EventBus.$on('term-updated', this.termUpdated);
  },
  beforeDestroy() {
    EventBus.$off('term-added', this.termAdded);
    EventBus.$off('term-removed', this.termRemoved);
    EventBus.$off('term-updated', this.termUpdated);
  },

  components: {
    CrudModalBar,
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      selected: null,
      modalInputs: {
        crudTarget: TermCrud,
        postCreate(result) { EventBus.$emit('term-added', result); },
        postDelete(result) { EventBus.$emit('term-removed', result); },
        postUpdate(result) { EventBus.$emit('term-updated', result); },
        templates: {
          title: { label: 'Term Name', type: 'input', placeholder: 'Spring \'18' },
          startDate: {
            label: 'Term Start Date', type: 'datepicker', placeholder: 'Select a date (mm/dd/yyyy)',
          },
          endDate: {
            label: 'Term End Date', type: 'datepicker', placeholder: 'Select a date (mm/dd/yyyy)',
          },
        },
      },
      terms: [],
    };
  },
  methods: {
    out: console.log,
    termAdded(term) {
      parseDates(term);
      this.terms.push(term);
    },
    termRemoved(term) { this.terms = this.terms.filter(t => t.id !== term.id); },
    termUpdated(term) { this.terms[this.terms.findIndex(t => t.id === term.id)] = term; },

    async fetchData() {
      const terms = (await TermCrud.get()).data;
      terms.forEach(parseDates);
      this.terms = terms;
    },
  },
};
</script>