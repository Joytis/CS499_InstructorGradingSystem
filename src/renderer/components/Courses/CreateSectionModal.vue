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
import { SectionCrud, EventBus } from '../../../../middleware';

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
      // const findPromise = new Promise((resolve, reject) => {
      //   'response-selected-term'
      // })
    },

    async attemptCreateSection() {
      try {
        // Copy props
        this.section.courseId = this.courseId;
        this.section.termId = this.termId;
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
