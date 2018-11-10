<template>
  <div>
    <back-button></back-button>
    <keep-alive>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Enrollment">
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
        <b-tab-item label="Assignments">
          <!-- Assignment modal-->
            <crud-modal-bar
              createTitle="Create Assignment"
              :inputs="assignmentInputs"
              :removed="['edit', 'delete']"
            />
          <!-- Assignments table-->
            <template>
              <b-table 
                :data="assCats.assignments"
                paginated 
                per-page="5"
                :selected.sync="selectedAssignment"
                >
                <template slot-scope="props">
                  <b-table-column field="id" label="Assignment ID" width="180" sortable>
                    {{ props.row.id }}
                  </b-table-column>
                  <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}
                  </b-table-column>
                  <b-table-column field="totalPoints" label="Total Points" sortable>
                    {{ props.row.totalPoints }}
                  </b-table-column>
                  <b-table-column field="dateCreated" label="Date Created" sortable>
                    {{ new Date(props.row.dateCreated).toLocaleDateString() }}
                  </b-table-column>
                  <b-table-column field="dueDate" label="Due Date" sortable>
                    {{ new Date(props.row.dueDate).toLocaleDateString() }}
                  </b-table-column>

                  <b-table-column label="Modify">
                    <crud-modal-bar
                      @click="selectedAssignment = props.row"
                      editTitle="Edit"
                      deleteTitle="Delete"
                      :inputs="assignmentInputs"
                      :target="props.row"
                      :removed="['create']"
                    />
                  </b-table-column>
                </template>
              </b-table>
            </template>
          </b-table-column>
        </b-tab-item>
        <b-tab-item label="Grades">

        </b-tab-item>
        <b-tab-item label="Section Settings">
          <!-- Assignment Category Modals -->
          <crud-modal-bar
            createTitle="Create Assignment Category"
            editTitle="Edit Assignment Category"
            deleteTitle="Delete Assignment Category"
            :target="selectedAssignmentCategory"
            :inputs="assignmentCategoryInputs"
          />

          <!-- Assignment Category Tables -->
          <b-table 
              :data="assCats" 
              paginated 
              per-page="5"
              :selected.sync="selectedAssignmentCategory"
          >
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
    </keep-alive>
  </div>
</template>

<script>
// import data from '../Courses/CourseListDataMock';
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import SectionEnrollmentModalForm from './SectionEnrollmentModal.vue';
import CrudModalBar from '../CrudModalBar.vue';
import {
  SectionCrud, StudentCrud, EventBus, AssignmentCategoryCrud, AssignmentCrud,
} from '../../../../middleware';
import BackButton from '../BackButton.vue';

export default {
  name: 'SectionPage',
  components: {
    BackButton,
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
    EventBus.$on('assignment-added', this.assignmentAdded);
    EventBus.$on('assignment-updated', this.assignmentUpdated);
    EventBus.$on('assignment-removed', this.assignmentRemoved);
    EventBus.$on('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$on('unenrolled-in-this-section', this.unenrolledInThisSection);
  },

  beforeDestroy() {
    // Unsubscribed. Downvoted.
    EventBus.$off('asscat-added', this.asscatAdded);
    EventBus.$off('asscat-updated', this.asscatUpdated);
    EventBus.$off('asscat-removed', this.asscatRemoved);
    EventBus.$off('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$off('unenrolled-in-this-section', this.unenrolledInThisSection);
  },

  data() {
    // Javascript doesn't allow us to reference other objects in our object, so
    //  we create a self-initializing object to manually assign the references after
    //  creation.
    const data = {
      activeTab: 0,
      section: null,
      students: [],
      assCats: [],
      selectedStudent: null,
      selectedAssignmentCategory: null,
      selectedAssignment: null,
      isEnrollmentModalActive: false,

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
            label: 'Weight', type: 'input', subtype: 'number', placeholder: 0.0, step: 0.01,
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
            type: 'b-dropdown',
            getData: null,
            value: 'id',
            key: 'id,',
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
        // Javascript doesn't allow us to reference other objects in our object, so
        //  we create a self-initializing object to manually assign the references after
        //  creation.
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
    async enrolledInThisSection(studentId) {
      const student = (await StudentCrud.get(studentId)).data;
      this.students.push(student);
    },
    unenrolledInThisSection(student) {
      this.students = this.students.filter(s => s.id !== student.id);
    },

    // Assignment category stuff
    async asscatAdded(assCat) {
      const custom = Object.assign({ assignments: [] }, assCat);
      const newUrl = urljoin(String(custom.id), '/assignments');
      const asscatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
      custom.assignments = (await asscatAssCrud.get()).data;
      this.assCats.push(custom);
    },
    asscatUpdated(assCat) {
      this.assCats[this.assCats.findIndex(a => a.id === assCat.id)] = assCat;
    },
    asscatRemoved(assCat) {
      this.assCats = this.assCats.filter(a => a.id !== assCat.id);
    },

    // assignment stuff
    assignmentAdded(assignment) {
      const asscat = this.assCats.find(a => a.id === assignment.assignmentCategoryId);
      asscat.assignments.push(assignment);
    },
    assignmentRemoved(assignment) {
      const asscat = this.assCats.find(a => a.id === assignment.assignmentCategoryId);
      asscat.assignments = asscat.assignments.filter(s => s.id !== assignment.id);
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
      const rawAssCats = (await this.assignmentCategoryCrud.get()).data;
      rawAssCats.forEach(ac => { ac.assignments = []; });
      this.assCats = rawAssCats;

      // Get assignments from said categories.
      const assPromises = rawAssCats.map(async (ac) => {
        const newUrl = urljoin(String(ac.id), '/assignments');
        const asscatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
        ac.assignments = (await asscatAssCrud.get()).data;
      });
      await Promise.all(assPromises);
    },

  },
};
</script>
