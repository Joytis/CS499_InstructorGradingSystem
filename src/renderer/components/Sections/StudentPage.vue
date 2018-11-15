<template>
  <div>
    <back-button></back-button>
    <nav class="level">
      <div class="level-item">
        {{ student.firstName }} {{ student.lastName }}
      </div>
      <div class="level-item">
        {{ course.title }} - {{ section.sectionNumber }}
      </div>
      <button @click="out(assignments)"/>>
    </nav>
    <b-table
      :data="assCats"
      paginated
      per-page="5"
      detailed
      detail-key="id"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Assignemnt Category">
          {{ props.row.name }}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <b-table 
          :data=props.row.assignments
        >
          <template slot-scope="props">
            <b-table-column field="name" label="Assignment Name">
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="totalPoints" label="Total points">
              {{ props.row.totalPoints }}
            </b-table-column>
          </template>
        </b-table>
      </template>
    </b-table>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import BackButton from '../BackButton.vue';
import {
  SectionCrud, CourseCrud, AssignmentCategoryCrud, // AssignmentCrud,
  // GradeCrud,
} from '../../../../middleware';

export default {
  name: 'StudentsPage',
  components: {
    BackButton,
  },

  created() {
    // create curds
    const studentSectionRoute = urljoin(this.$route.params.sectionId, '/students');
    this.sectionStudentCrud = SectionCrud.fromAppendedRoute(studentSectionRoute);
    const assCatsRoute = urljoin(this.$route.params.sectionId, '/assignmentCategories');
    this.assignmentCategoryCrud = SectionCrud.fromAppendedRoute(assCatsRoute);

    this.fetchData();
  },

  data() {
    return {
      section: [],
      student: [],
      course: [],
      assCats: [],
      assignments: [],

    };
  },
  methods: {
    async fetchData() {
      // get course info for header
      this.course = (await CourseCrud.get(this.$route.params.courseId)).data;

      // get section
      this.section = (await SectionCrud.get(this.$route.params.sectionId)).data;

      // get student
      this.rawStudents = (await this.sectionStudentCrud.get()).data;
      this.student = this.rawStudents.find(s => String(s.id) === this.$route.params.studentId);

      // Get assignments categories for section
      const rawAssCats = (await this.assignmentCategoryCrud.get()).data;
      rawAssCats.forEach(ac => { ac.assignments = []; });
      this.assCats = rawAssCats;

      // get assignents from each categories
      const assPromises = rawAssCats.map(async (ac) => {
        const newUrl = urljoin(String(ac.id), '/assignments');
        const assCatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
        const rawAssignments = (await assCatAssCrud.get()).data;
        rawAssignments.forEach((a) => {
          // a.assignments = ac;
          a.dueDate = new Date(Date.parse(a.dueDate));
          console.log(a);
          this.assignments.push(a);
        });
        ac.assignments = rawAssignments;
      });
      await Promise.all(assPromises);
    },
    out(args) {
      console.log(args);
    },
  },
};
</script>

<style>
</style>
