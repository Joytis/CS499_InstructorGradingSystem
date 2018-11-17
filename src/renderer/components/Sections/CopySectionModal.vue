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
      <div v-else>
        <b-field label="Term to Copy To">
          <b-select v-model="termId" placeholder="Select an option" required>
            <option v-for="option in terms" :value="option.id" :key="option.id">
              {{ option.title }}
            </option>
          </b-select>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div v-if="state === 'main'">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary" @click="attemptSectionCopy">Copy</button>
      </div>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import urljoin from 'url-join';
import {
  ParseError, TermCrud, SectionCrud, Finders,
} from '../../../../middleware';

export default {
  name: 'CopySectionModal',
  components: {
    AtomSpinner,
  },
  props: {
    target: Object,
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      error: undefined,
      state: 'main',
      terms: null,
      termId: null,
    };
  },

  methods: {
    async attemptSectionCopy() {
      try {
        const url = urljoin(urljoin(String(this.target.id), 'copyToTerm'), String(this.termId));
        const crudTarget = SectionCrud.fromAppendedRoute(url);
        // Display loading
        this.state = 'loading';
        // Wait for term creation
        await crudTarget.post({});
        // wait for two seconds then close window.
        this.state = 'success';
      } catch (err) {
        this.state = 'error';
        this.error = ParseError(err);
        console.log(err);
        // DISPLAY ERROR MODAL?
      }
    },
    async fetchData() {
      this.terms = (await TermCrud.get()).data;
      const selectedTerm = await Finders.SelectedTerm();
      this.terms = this.terms.filter(t => t.id !== selectedTerm.id);
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
