<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Create Course Section for Term</p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner :animation-duration="1000" :size="200" :color="'#cd5bef'"/>
      </div>
      <div v-else-if="state === 'error'">
        <div> {{ error.message }} </div>
      </div>
      <div v-else-if="state === 'success'">
        Success!
      </div>
      <div v-else>
        <b-field label="Section Number">
          <b-input type="number" v-model="section.sectionNumber" placeholder="00" required />
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click="attemptCreateSection">Create</button>
    </footer>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { SectionCrud, EventBus, RaceTimer } from '../../../../middleware';

export default {
  name: 'CreateSectionModal',
  components: {
    AtomSpinner,
  },
  props: {
    courseId: Number,
    termId: Number,
  },

  data() {
    return {
      error: undefined,
      state: 'main',
      section: {
        sectionNumber: '',
        courseId: undefined,
        termId: undefined,
      },
    };
  },
  methods: {

    async attemptFindSelectedTerm() {
      let term = null;
      let res;
      const resolver = (t) => {
        term = t;
        res();
      };
      // Listen the response, then resolve our object.
      EventBus.$on('response-selected-term', resolver);
      const findPromise = new Promise((resolve) => {
        // Set the resolver for our functor.
        res = resolve;
        // request our term.
        EventBus.$emit('request-selected-term');
      });

      // Dawg if we don't find that in 20 ms then it's not there lol.
      const timer = RaceTimer(20, findPromise).catch(err => {
        this.error = err;
        this.state = 'error';
        throw new Error('Couldnt find an active term');
      });
      await timer;
      // Don't listen for the response anymore.
      EventBus.$off('response-selected-term', resolver);
      return term;
    },

    async attemptCreateSection() {
      try {
        // Copy props
        this.section.courseId = this.courseId;
        this.section.termId = (await this.attemptFindSelectedTerm()).id;
        console.log(this.section.courseId);
        console.log(this.section.termId);
        // Send to Db.
        this.state = 'loading';
        const section = (await SectionCrud.post(this.section)).data;
        this.state = 'success';
        EventBus.$emit('section-added', section);
      } catch (err) {
        console.error(err);
        this.state = 'error';
        this.error = err;
      }
    },
  },
};
</script>
