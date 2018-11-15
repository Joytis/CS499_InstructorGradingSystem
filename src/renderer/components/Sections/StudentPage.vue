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
      <button @click="out(student)"/>>
    </nav>
    <b-table
      :data="assignmentTableData"
      paginated
      per-page="5"
      detailed
      detail-key="id"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Assignemnt Category">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="categoryAverage" label="Grade Average">
          {{ getAverage(props.row) }}%
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
            <b-table-column field="score" label="Points earned">
              {{ (props.row.grade) ? props.row.grade.score : 'No Grade' }}
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
  SectionCrud, CourseCrud, AssignmentCategoryCrud, StudentCrud, // AssignmentCrud,
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
      student: {},
      course: [],
      assCats: [],
      assignments: [],
      rawStudentGrades: [],

    };
  },
  methods: {
    async getFilteredGrades(student) {
      const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(student.id), '/grades'));
      this.rawStudentGrades = (await studentGradeCrud.get()).data;
      const filter = g => this.assignments.findIndex(a => g.assignmentId === a.id) !== -1;
      student.grades = this.rawStudentGrades.filter(filter);

      // Add linked assignment to grade
      student.grades.forEach(g => {
        g.assignment = this.assignments.find(a => g.assignmentId === a.id);
      });
    },
    async fetchData() {
      // get course info for header
      this.course = (await CourseCrud.get(this.$route.params.courseId)).data;

      // get section
      this.section = (await SectionCrud.get(this.$route.params.sectionId)).data;

      // get student
      let rawStudents = (await this.sectionStudentCrud.get()).data;
      rawStudents.forEach(stud => { stud.grades = []; });
      rawStudents = rawStudents.find(s => String(s.id) === this.$route.params.studentId);
      this.student = rawStudents;
      console.log(this.student);

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
          // console.log(a);
          this.assignments.push(a);
        });
        ac.assignments = rawAssignments;
      });
      await Promise.all(assPromises);

      // Get grade info from student
      this.getFilteredGrades(this.student);
    },
    out(args) {
      console.log(args);
    },
    getAverage(category) {
      // get the students average score for each category
      let scoreTotal = 0;
      let scorePossible = 0;
      if (category.assignments.length <= 0) {
        // return false;
      }
      for (let i = 0; i < category.assignments.length; i += 1) {
        if (typeof (category.assignments[i].grade) === 'undefined') {
          // return false;
        } else {
          scoreTotal += category.assignments[i].grade.score;
          scorePossible += category.assignments[i].totalPoints;
        }
      }
      return Number((scoreTotal / scorePossible) * 100).toFixed(2);
    },
  },
  computed: {
    assignmentTableData() {
      // let scoreTotal = 0;
      // let scorePossible = 0;
      const data = this.assCats.map(ac => {
        ac.assignments.forEach(a => {
          a.grade = this.rawStudentGrades.find(g => g.assignmentId === a.id);
        });
        return ac;
      });
      return data;
    },
  },
};
</script>

<style>
</style>
