<template>
    
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import urljoin from 'url-join';
import { AgGridVue } from 'ag-grid-vue';
import customCellEditor from '../customCellEditor';
import customValueParser from '../customValueParser';
import CrudModalBar from '../CrudModalBar.vue';
import {
  SectionCrud, StudentCrud, EventBus, AssignmentCategoryCrud, AssignmentCrud,
  EnrollmentCrud, GradeCrud, QuickMaffs,
} from '../../../../middleware';
import BackButton from '../BackButton.vue';
import CopySectionModal from './CopySectionModal.vue';
import '../../../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
import '../../../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';

export default {
  name: 'SectionPage',
  components: {
    BackButton,
    SectionEnrollmentModalForm,
    CrudModalBar,
    CopySectionModal,
    AgGridVue,
  },
  data() {
    const data = {
      activeTab: 0,
      section: null,
      allStudents: [],
      students: [],
      assCats: [],
      assignments: [],
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
    async trySubmitOrUpdateGrade(submission) {
      if (submission.newValue !== submission.oldValue) {
        const gradeArgs = {
          studentId: submission.data.studentId,
          assignmentId: submission.colDef.assignmentId,
          isSubmitted: true,
          score: Number(submission.newValue),
          submissionDate: Date.now(),
        };
        try {
          const linkedGrade = submission.data[`${submission.colDef.field}Link`];
          if (!linkedGrade) {
            await GradeCrud.post(gradeArgs);
          } else {
            await GradeCrud.put(linkedGrade.id, { data: gradeArgs });
          }
        } catch (err) {
          console.log(err);
        }
        this.updateAssignmentGrade(gradeArgs).then().catch(err => console.log(err));
      }
    },

  async getAssignmentGrades(assignment) {
      const assignmentGradeCrud = AssignmentCrud.fromAppendedRoute(urljoin(String(assignment.id), '/grades'));
      const rawAssignmentGrades = (await assignmentGradeCrud.get()).data;
      rawAssignmentGrades.forEach(g => {
        assignment.grades.push(g);
      });
    },

  async updateAssignmentGrade(assignment) {
      const assIndex = this.assignments.findIndex(a => a.id === assignment.assignmentId);
      const assignmentGradeCrud = AssignmentCrud.fromAppendedRoute(urljoin(String(assignment.assignmentId), '/grades'));
      const rawAssignmentGrades = (await assignmentGradeCrud.get()).data;
      rawAssignmentGrades.forEach(g => {
        const gradeIndex = this.assignments[assIndex].grades.findIndex(eg => g.id === eg.id);
        if (gradeIndex >= 0) {
          this.assignments[assIndex].grades.splice(gradeIndex, 1, g);
        } else this.assignments[assIndex].grades.push(g);
      });
    },

  async getFilteredGrades(student) {
      const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(student.id), '/grades'));
      const rawStudentGrades = (await studentGradeCrud.get()).data;
      const filter = g => this.assignments.findIndex(a => g.assignmentId === a.id) !== -1;
      student.grades = rawStudentGrades.filter(filter);

      // Add linked assignment to grade
      student.grades.forEach(g => {
        g.assignment = this.assignments.find(a => g.assignmentId === a.id);
      });
    },

    

  },
}
</script>

<style>

</style>
