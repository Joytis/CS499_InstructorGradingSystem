<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Students">
        <button class="button is-primary is-small" @click="isEnrollmentModalActive = true"> 
          Enroll new Student
        </button>
        <b-modal :active.sync="isEnrollmentModalActive" :width="640" scroll="keep" has-modal-card>
          <section-enrollment-modal-form :sectionId="Number($route.params.sectionId)"></section-enrollment-modal-form>
        </b-modal>
        <b-table :data="students" paginated per-page="10" :selected.sync="selectedStudent">
            <template slot-scope="props">
              <b-table-column field="Name" label="Name" width="300" sortable>
                {{ `${props.row.firstName} ${props.row.lastName}` }}
              </b-table-column>
              <b-table-column field="Email" label="Email" sortable>
                {{ props.row.email }}
              </b-table-column>
            </template>
        </b-table>
      </b-tab-item>
      <b-tab-item label="AssignmentCategories">
        <!-- Assignment Category Modals -->
        <crud-modal-bar
          createTitle="Create Assignment Category"
          editTitle="Edit Assignment Category"
          deleteTitle="Delete Assignment Category"
          :target="selectedAssignmentCategory"
          :inputs="assignmentCategoryInputs"
        />

        <!-- Assignment Category Tables -->
        <b-table :data="assCats" paginated per-page="5" :selected.sync="selectedAssignmentCategory">
          <template slot-scope="props">
            <b-table-column field="Name" label="Name" width="300" sortable>
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="Weight" label="Weight" sortable>
              {{ props.row.weight }}
            </b-table-column>
            <b-table-column field="Lowest Grades Dropped" label="Lowest Grades Dropped" sortable>
              {{ props.row.lowestGradesDropped }}
            </b-table-column>
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// import data from '../Courses/CourseListDataMock';
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import SectionEnrollmentModalForm from './SectionEnrollmentModal.vue';
import CrudModalBar from '../CrudModalBar.vue';
import {
  SectionCrud, StudentCrud, EventBus, AssignmentCategoryCrud, Finders,
} from '../../../../middleware';

export default {
  name: 'SectionPage',
  components: {
    SectionEnrollmentModalForm,
    CrudModalBar,
  },

  created() {
    // Create cruds
    const studentSectionRoute = urljoin(this.$route.params.sectionId, '/students');
    this.sectionStudentCrud = SectionCrud.fromAppendedRoute(studentSectionRoute);
    const assCatRoute = urljoin(this.$route.params.sectionId, '/assignmentCategories');
    this.assignmentCategoryCrud = SectionCrud.fromAppendedRoute(assCatRoute);

    // Fetch data
    this.fetchData();

    // Subscribe to evets.
    EventBus.$on('asscat-added', this.asscatAdded);
    EventBus.$on('asscat-updated', this.asscatUpdated);
    EventBus.$on('asscat-removed', this.asscatRemoved);
    EventBus.$on('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$on('unenrolled-in-this-section', this.unenrolledInThisSection);
    EventBus.$on('request-selected-section', this.sectionRequested);
  },

  beforeDestroy() {
    // Unsubscribed. Downvoted.
    EventBus.$off('asscat-added', this.asscatAdded);
    EventBus.$off('asscat-updated', this.asscatUpdated);
    EventBus.$off('asscat-removed', this.asscatRemoved);
    EventBus.$off('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$off('unenrolled-in-this-section', this.unenrolledInThisSection);
    EventBus.$off('request-selected-section', this.sectionRequested);
  },

  data() {
    return {
      activeTab: 0,
      section: null,
      students: [],
      selectedStudent: null,
      isEnrollmentModalActive: false,

      assCats: [],
      selectedAssignmentCategory: null,
      isAssignmentCategoryCreationActive: false,
      isAssignmentCategoryEditActive: false,

      assignmentCategoryInputs: {
        crudTarget: AssignmentCategoryCrud,
        async preCreate(staged) {
          // Retrieve the desired course and term ID
          const sectionId = (await Finders.SelectedSection()).id;
          return Object.assign({ sectionId }, staged);
        },
        postCreate(result) { EventBus.$emit('asscat-added', result); },
        postUpdate(result) { EventBus.$emit('asscat-updated', result); },
        templates: {
          name: { label: 'Name', type: 'input', placeholder: 'Category Name' },
          weight: {
            label: 'Weight', type: 'input', subtype: 'number', placeholder: 0.0,
          },
          lowestGradesDropped: {
            label: 'Lowest Grades Dropped', type: 'input', subtype: 'number', placeholder: 0,
          },
        },
      },
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
    sectionRequested() { EventBus.$emit('response-selected-section', this.section); },

    asscatAdded(assCat) { this.assCats.push(assCat); },
    asscatUpdated(assCat) {
      this.assCats[this.assCats.findIndex(a => a.id === assCat.id)] = assCat;
    },
    asscatRemoved(assCat) {
      this.assCats = this.assCats.filter(a => a.id !== assCat.id);
    },

    async fetchData() {
      // Get Section:
      this.section = (await SectionCrud.get(this.$route.params.sectionId)).data;
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

      // Get assignment category information.
      this.assCats = (await this.assignmentCategoryCrud.get()).data;
    },

  },
};
</script>
