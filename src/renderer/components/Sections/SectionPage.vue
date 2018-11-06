<template>
  <div>
    <div class="box">
      <nav class="level">
        <div class="level-item">
          {{ $route.params.courseId }}
        </div>
        <div class="level-item">
          {{ $route.params.sectionId }}
        </div>
      </nav>
    </div>
    <br>
    Students:

    <button class="button is-primary is-small" @click="isEnrollmentModalActive = true"> 
      Enroll new Student
    </button>
    <b-modal :active.sync="isEnrollmentModalActive" :width="640" scroll="keep" has-modal-card>
      <section-enrollment-modal-form :sectionId="Number($route.params.sectionId)"></section-enrollment-modal-form>
    </b-modal>

    <b-table :data="students" paginated per-page="10" :selected.sync="selectedCourse">
        <template slot-scope="props">
          <b-table-column field="Name" label="Name" width="300" sortable>
            {{ `${props.row.firstName} ${props.row.lastName}` }}
          </b-table-column>
          <b-table-column field="Email" label="Email" sortable>
            {{ props.row.email }}
          </b-table-column>
        </template>
    </b-table>
  </div>
</template>

<script>
// import data from '../Courses/CourseListDataMock';
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import SectionEnrollmentModalForm from './SectionEnrollmentModal.vue';
import { SectionCrud, StudentCrud, EventBus } from '../../../../middleware';

export default {
  name: 'SectionPage',
  components: { SectionEnrollmentModalForm },

  created() {
    // Create cruds
    const studentSectionRoute = urljoin(this.$route.params.sectionId, '/students');
    this.sectionStudentCrud = SectionCrud.fromAppendedRoute(studentSectionRoute);
    const assCatRoute = urljoin(this.$route.params.sectionId, '/assignmentCategories');
    this.assignmentCategoryCrud = SectionCrud.fromAppendedRoute(assCatRoute);

    // Fetch data
    this.fetchData();

    // Subscribe to evets.
    EventBus.$on('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$on('unenrolled-in-this-section', this.unenrolledInThisSection);
  },

  beforeDestroy() {
    // Unsubscribed. Downvoted.
    EventBus.$off('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$off('unenrolled-in-this-section', this.unenrolledInThisSection);
  },

  data() {
    return {
      isEnrollmentModalActive: false,
      selectedCourse: null,
      students: [],
    };
  },
  methods: {
    async enrolledInThisSection(studentId) {
      const student = (await StudentCrud.get(studentId)).data;
      this.students.push(student);
    },
    unenrolledInThisSection(student) {
      this.students = this.students.filter(s => s.id !== student.id);
    },

    async fetchData() {
      // Get students.
      const rawStudents = (await this.sectionStudentCrud.get()).data; // Get all students in section
      rawStudents.forEach(stud => { stud.grades = []; });
      this.students = rawStudents;

      // Get grade info from said student.
      const promises = rawStudents.map(async (s) => {
        const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(s.id), '/grades'));
        s.grades = (await studentGradeCrud.get()).data;
      });
      await Promise.all(promises);
    },

  },
};
</script>
