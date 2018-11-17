<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title"> Enrollment </p>
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
        <b-field label="Simple">
          <b-select placeholder="Select a name" v-model="studentId">
            <option v-for="option in students" :value="option.id">
              {{ `${option.lastName}, ${option.firstName}` }}
            </option>
          </b-select>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" v-text="'Enroll'" @click="attemptEnroll"/>
    </footer>
  </div>
</template>



<script>
/* eslint-disable no-console */
import urljoin from 'url-join';
import { AtomSpinner } from 'epic-spinners';
import {
  SectionCrud, StudentCrud, EnrollmentCrud, EventBus,
} from '../../../../middleware';

export default {
  name: 'CreationModalForm',
  components: { AtomSpinner },
  props: { sectionId: Number },
  data() {
    return {
      error: undefined,
      state: 'main',
      studentId: -1,
      students: [],
    };
  },

  created() {
    const studentSectionRoute = urljoin(String(this.sectionId), '/students');
    this.sectionStudentCrud = SectionCrud.fromAppendedRoute(studentSectionRoute);

    this.fetchData();
  },

  methods: {
    async fetchData() {
      const students = (await StudentCrud.get()).data; // Get all courses
      const enrolledStudents = (await this.sectionStudentCrud.get()).data; // get all enrolled;
      const enrolledStudentIds = enrolledStudents.map(s => s.id);

      this.students = students.filter(s => !enrolledStudentIds.includes(s.id));
    },

    async attemptEnroll() {
      try {
        // Display loading
        this.state = 'loading';
        // Wait for term creation
        const staged = {
          studentId: Number(this.studentId),
          sectionId: Number(this.sectionId),
        };
        await EnrollmentCrud.post(staged);
        // wait for two seconds then close window.
        this.state = 'success';
        EventBus.$emit('enrolled-in-this-section', this.studentId);
      } catch (err) {
        this.state = 'error';
        this.error = err;
      }
    },
  },

};
</script>

<style>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
