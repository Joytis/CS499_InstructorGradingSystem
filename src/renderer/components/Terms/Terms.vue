<template>
  <section>

    <button class="button is-primary is-small"@click="isCreationModalActive = true"> 
      Create New Term 
    </button>
    <button class="button is-warning is-small" @click="isEditThingsModalActive = true" :disabled="!selected">
      Edit Term
    </button>
    <b-modal :active.sync="isCreationModalActive" :width="640" scroll="keep" has-modal-card>
      <creation-modal-form :inputs="modalInputs"></creation-modal-form>
    </b-modal>
    <b-modal :active.sync="isEditThingsModalActive" :width="640" scroll="keep" has-modal-card>
      <edit-things-modal-form :inputs="modalInputs" :target="selected"></edit-things-modal-form>
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
          {{ props.row.startDate.toString() }}
        </b-table-column>
        <b-table-column field="endDate" label="End Date" numeric>
          {{ props.row.endDate.toString() }}
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
import CreationModalForm from '../CreationModal.vue';
import EditThingsModalForm from '../EditThingsModal.vue';
import { TermCrud, EventBus } from '../../../../middleware';


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
    CreationModalForm,
    EditThingsModalForm,
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      selected: null,
      modalInputs: {
        crudTarget: TermCrud,
        postCreate(result) { EventBus.$emit('term-added', result); },
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
    termAdded(term) { this.terms.push(term); },
    termRemoved(term) { this.terms = this.terms.filter(t => t.id !== term.id); },
    termUpdated(term) { this.terms[this.terms.findIndex(t => t.id === term.id)] = term; },

    async fetchData() {
      const terms = (await TermCrud.get()).data;
      terms.forEach(term => {
        term.startDate = new Date(Date.parse(term.startDate));
        term.endDate = new Date(Date.parse(term.endDate));
      });
      this.terms = terms;
    },
  },
};
</script>