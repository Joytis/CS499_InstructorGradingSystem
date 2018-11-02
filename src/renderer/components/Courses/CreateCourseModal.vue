<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Create Course</p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner
            :animation-duration="1000"
            :size="200"
            :color="'#cd5bef'"
         />
      </div>
      <div v-else-if="state === 'error'">
        <div> {{ error.message }} </div>
      </div>
      <div v-else-if="state === 'success'">
        Success!
      </div>
      <div v-else>
        <b-field label="Course Label">
          <b-input
            v-model="course.courseLabel"
            placeholder="CS100"
            required>
          </b-input>
        </b-field>
        <b-field label="Course Title">
          <b-input
            v-model="course.title"
            placeholder="Intro to Code"
            required>
          </b-input>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="attemptCourseCreate">Create</button>
    </footer>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { CourseCrud, EventBus } from '../../../../middleware';

export default {
  name: 'CreateCourseModal',
  components: {
    AtomSpinner,
  },
  props: [],
  data() {
    return {
      error: undefined,
      state: 'main',
      course: {
        title: '',
        courseLabel: '',
      },
    };
  },
  methods: {
    async attemptCourseCreate() {
      try {
        this.state = 'loading';
        const course = (await CourseCrud.post(this.course)).data;
        this.state = 'success';
        EventBus.$emit('course-added', course);
      } catch (err) {
        console.error(err);
        this.state = 'error';
        this.error = err;
      }
    },
  },
};
</script>
