<template>
  <div>
    Eh, it probably works<br>
    <button class="button is-primary is-small" @click="out(section)">
      Section
    </button>
    <button class="button is-primary is-small" @click="out(assignments)">
      Assignments
    </button>
    <button class="button is-primary is-small" @click="out(indices)">
      Indices
    </button>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import urljoin from 'url-join';
import { AgGridVue } from 'ag-grid-vue';
// import customCellEditor from '../customCellEditor';
// import customValueParser from '../customValueParser';
import CrudModalBar from '../CrudModalBar.vue';
import {
  SectionCrud, EventBus, AssignmentCategoryCrud, AssignmentCrud, StudentCrud,
  // EnrollmentCrud, GradeCrud, QuickMaffs,
} from '../../../../middleware';
import BackButton from '../BackButton.vue';
import CopySectionModal from './CopySectionModal.vue';
import '../../../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
import '../../../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';

export default {
  name: 'SectionPage',
  components: {
    BackButton,
    CrudModalBar,
    CopySectionModal,
    AgGridVue,
  },
  created() {
    const studentSectionRoute = urljoin(this.$route.params.sectionId, '/students');
    this.sectionStudentCrud = SectionCrud.fromAppendedRoute(studentSectionRoute);
    const assCatRoute = urljoin(this.$route.params.sectionId, '/assignmentCategories');
    this.assignmentCategoryCrud = SectionCrud.fromAppendedRoute(assCatRoute);

    this.fetchData();
  },
  data() {
    const data = {
      activeTab: 0,
      section: null,
      allStudents: [],
      students: [],
      assCats: [],
      rawAssCats: [],
      assignments: [],
      indices: {},
      selectedStudent: null,
      selectedAssignmentCategory: null,
      selectedAssignment: null,
      isEnrollmentModalActive: false,
      isCopyModalActive: false,
      showAnalytics: false,

      // Modal input details.
      assignmentCategoryInputs: {
        crudTarget: AssignmentCategoryCrud,
        preCreate: null,
        postCreate(result) { EventBus.$emit('asscat-added', result); },
        postUpdate(result) { EventBus.$emit('asscat-updated', result); },
        postDelete(result) { EventBus.$emit('asscat-removed', result); },
        templates: {
          name: { label: 'Name', type: 'input', placeholder: 'Category Name' },
          weight: {
            label: 'Weight', type: 'input', subtype: 'number', placeholder: 0.0, step: 0.01, max: 1,
          },
          lowestGradesDropped: {
            label: 'Lowest Grades Dropped', type: 'input', subtype: 'number', placeholder: 0,
          },
        },
      },

      assignmentInputs: {
        crudTarget: AssignmentCrud,
        postCreate(result) { EventBus.$emit('assignment-added', result); },
        postUpdate(result) { EventBus.$emit('assignment-updated', result); },
        postDelete(result) { EventBus.$emit('assignment-removed', result); },
        templates: {
          assignmentCategoryId: {
            label: 'Assignment Category',
            type: 'dropdown',
            getData: null,
            value: 'id',
            key: 'id,',
            display: option => option.name,
          },
          name: {
            label: 'Name', type: 'input', placeholder: 'Assignment name',
          },
          totalPoints: {
            label: 'Total Points', type: 'input', subtype: 'number', placeholder: 100,
          },
          dueDate: {
            label: 'Due Date', type: 'datepicker', placeholder: 'Select a date (mm/dd/yyyy)',
          },
        },
      },

      init() {
        this.assignmentInputs.templates.assignmentCategoryId.getData = () => this.assCats;
        this.assignmentCategoryInputs.preCreate = (staged) => {
          // Retrieve the desired course and term ID
          const sectionId = this.section.id;
          return Object.assign({ sectionId }, staged);
        };
      },
    };
    data.init();
    return data;
  },
  methods: {
    out(args) {
      console.log(args);
    },
    async fetchData() {
      // Get Section:
      this.section = (
        await SectionCrud.get(this.$route.params.sectionId)
      ).data;

      // Get students.
      const rawStudents = (await this.sectionStudentCrud.get()).data;

      // Get all students in section
      this.section.students = rawStudents;

      // Get the assignment categories for the section
      this.rawAssCats = (await this.assignmentCategoryCrud.get()).data;

      // Append an array of assignments to the assignment categories
      const assPromises = this.rawAssCats.map(async (ac) => {
        const newUrl = urljoin(String(ac.id), '/assignments');
        const asscatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
        const assignments = (await asscatAssCrud.get()).data;
        assignments.forEach((a) => {
          a.dueDate = new Date(Date.parse(a.dueDate));
          a.grade = {};
          this.assignments.push(a);
        });
        ac.assignments = assignments;
      });
      await Promise.all(assPromises);


      // Append assignment categories to each student
      this.section.students.forEach(stud => {
        stud.assCats = this.rawAssCats;
      });

      // Calculate indices once to avoid doing comps for each student
      // If there are assignments, map the correct grade to each student
      if (this.section.students
        && this.section.students[0]
        && this.section.students[0].assCats[0]
        && this.section.students[0].assCats[0].assignments
        && this.section.students[0].assCats[0].assignments[0]) {
        console.log('I\'m executing!');

        this.section.students[0].assCats.forEach((ac, acind) => {
          ac.assignments.forEach((a, aind) => {
            this.indices[`IndexOf${a.id}`] = {
              aIndex: aind,
              acIndex: acind,
            };
          });
        });
        console.log('Indices!', this.indices);

        const gradePromises = this.section.students.map(async (s) => {
          const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(s.id), '/grades'));
          const rawStudentGrades = (await studentGradeCrud.get()).data;
          const filter = g => this.indices[`IndexOf${g.assignmentId}`];
          const grademap = rawStudentGrades.filter(filter);
          grademap.forEach(g => {
            s.assCats[this.indices[`IndexOf${g.assignmentId}`].acIndex]
              .assignments[this.indices[`IndexOf${g.assignmentId}`].aIndex].grade = g;
          });
        });
        await Promise.all(gradePromises);
      }

    //   const promises1 = this.assignments.map(async (a) => {
    //     await this.getAssignmentGrades(a);
    //   });

    //   await Promise.all(promises.concat(promises1));

    //   this.allStudents = (await StudentCrud.get()).data;
    },
  },
};
</script>

