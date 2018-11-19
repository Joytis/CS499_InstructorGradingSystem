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
    </nav>
    <nav class="level">
      <div class="level-item">
        <button class="button" @click="overallGrade(), displayGrade = true">
          <div v-if="displayGrade === true">
            {{ Number(this.grade * 100).toFixed(2) }}%
          </div>
          <div v-else>
            Click to display grade
          </div>
        </button>
      </div>
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
          {{ getAverage(props.row) }}
          {{ (props.row.categoryAverage > -1) ? `${props.row.categoryAverage}%` : 'None'}}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <b-table 
          :data=props.row.assignments
        >
          <template slot-scope="props">
            <b-table-column field="name" label="Assignment Name">
              <b-tooltip v-if="props.row.dropped" class="is-accent" label="Dropped from calculation" position="is-right">
                <s>
                  {{ props.row.name }}
                </s>
              </b-tooltip>
              <div v-else>
                {{ props.row.name }}
              </div>
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
// {{ (overallGrade * 100) || 'Nothing' }}%
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
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
      grade: 0,
      displayGrade: false,
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
      // this.getAverage;
      // this.grade = this.overAllGrade;
    },
    out(args) {
      console.log(args);
    },
    sortedGrades(a, b) {
      if ((a.grade.score / a.totalPoints) < (b.grade.score / b.totalPoints)) {
        return -1;
      }
      if ((a.grade.score / a.totalPoints) > (b.grade.score / b.totalPoints)) {
        return 1;
      }
      return 0;
    },
    getAverage(category) {
      // get the students average score for each category
      let scoreTotal = 0;
      let scorePossible = 1;
      if (category.assignments.length <= 0) {
        category.categoryAverage = 'Nope';
        // return false;
      } else {
        scorePossible = 0;
        for (let i = 0; i < category.assignments.length; i += 1) {
          if (typeof (category.assignments[i].grade) !== 'undefined') {
            if (category.assignments[i].dropped !== true) {
              scoreTotal += category.assignments[i].grade.score;
              scorePossible += category.assignments[i].totalPoints;
            }
          }
        }
      }
      if (scorePossible !== 0) {
        category.categoryAverage = Number((scoreTotal / scorePossible) * 100).toFixed(2);
      } else {
        category.categoryAverage = -1;
      }
      // return Number((scoreTotal / scorePossible) * 100).toFixed(2);
    },
    overallGrade() {
      this.grade = 0;
      this.assCats.forEach(ac => {
        if (ac.categoryAverage !== -1) {
          this.grade += (ac.categoryAverage / 100) * this.categoryWeights[ac.id];
        }
      });
    },
  },
  computed: {
    assignmentTableData() {
      // attaching grades to assignments and flagging grades to be dropped
      const data = this.assCats.map(ac => {
        const grades = [];
        ac.assignments.forEach(a => {
          a.grade = this.rawStudentGrades.find(g => g.assignmentId === a.id);
          if (typeof (a.grade) !== 'undefined') {
            grades.push(a);
          }
        });
        grades.sort(this.sortedGrades);
        console.log(grades);
        for (let i = 0; i < ac.lowestGradesDropped; i += 1) {
          if (typeof (grades[i]) !== 'undefined') {
            grades[i].dropped = true;
          }
        }
        return ac;
      });
      return data;
    },
    categoryWeights() {
      let catWeightsTotal = 0;
      this.assCats.forEach(ac => {
        if (ac.categoryAverage !== -1) {
          catWeightsTotal += ac.weight;
        }
      });
      const catWeights = {};
      this.assCats.forEach(assCat => {
        catWeights[assCat.id] = assCat.weight / catWeightsTotal;
      });
      return catWeights;
    },
    // overallGrade() {
    //   let grade = 0;
    //   this.assCats.forEach(ac => {
    //     grade += (ac.categoryAverage / 100) * this.categoryWeights[ac.id];
    //     console.log(ac.categoryAverage / 100);
    //     console.log(this.categoryWeights[ac.id]);
    //   });
    //   return grade;
    // },
  },
};
</script>

<style>
</style>
