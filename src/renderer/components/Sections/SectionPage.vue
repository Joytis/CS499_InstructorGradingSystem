<template>
  <div>
    <back-button></back-button>
    <router-link class="button is-primary is-small" :to=" $route.params.sectionId + '/whatIf'">
      ?
    </router-link>
    <button 
      class="button is-primary is-small" 
      @click="isCopyModalActive = true"
      style="text-align: right"
    >
      Copy Section
    </button>
    <button @click="out(students)"/>
    <button @click="out(formattedData)"/>
    <button @click="out(studentCatAverage)"/>
    <b-modal :active.sync="isCopyModalActive" :width="640" scroll="keep" has-modal-card>
      <copy-section-modal :target="section"></copy-section-modal>
    </b-modal>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Enrollment">
        <crud-modal-bar 
          createTitle="Enroll Student"
          deleteTitle="Unenroll Student"
          deleteMessage= "Are you sure? This will mess up student grades."
          :inputs="enrollmentModalInputs"
          :target="selectedStudent"
          :removed="['edit']"
        />
        <b-checkbox v-model="gradesIsVisible">
          Grades
        </b-checkbox>
        <b-table :data="students" paginated per-page="10" :selected.sync="selectedStudent">
            <template slot-scope="props">
              <b-table-column field="Name" label="Name" width="300" sortable>
                {{ `${props.row.firstName} ${props.row.lastName}` }}
              </b-table-column>
              <b-table-column field="Email" label="Email" sortable>
                {{ props.row.email }}
              </b-table-column>
              <b-table-column label="Grade" sortable>
                <div v-if="gradesIsVisible">
                  {{ (studentCatAverage.find(g => g.id === props.row.id).overallAverage !== 'None') ? `${studentCatAverage.find(g => g.id === props.row.id).overallAverage}%` : 'None' }} ({{ getLetterGrade(studentCatAverage.find(g => g.id === props.row.id).overallAverage)}})
                </div>
              </b-table-column>
              <b-table-column label="Student Page">
                <button class="button is-success is-small">
                  <router-link :to=" $route.params.sectionId + '/' + props.row.id">
                    <b-icon type="is-accent" icon="account-details">
                    </b-icon>
                  </router-link>
                </button>
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
              :data="assignments"
              paginated 
              per-page="10"
              :selected.sync="selectedAssignment"
              >
              <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column field="category" label="Assignment Category" width="180" sortable>
                  {{ props.row.assignmentCategory.name }}
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
      </b-tab-item>
      <b-tab-item label="Grades">
        <button class="button" @click="OnExport()">
          Export File
        </button>
        <ag-grid-vue :style="{width: '100%', height: gradeTableHeight}"
          class="ag-theme-balham"
          :columnDefs="assignmentColumns"
          :rowData="studentGradeRows"
          :cellValueChanged="trySubmitOrUpdateGrade"
          :gridReady="onGridReady"/>
        Show Analytics: <b-switch v-model="showAnalytics" class="is-primary is-small"/>
        <div v-if="showAnalytics">
          <ag-grid-vue style="width: 100%; height: 21vh;"
          class="ag-theme-balham"
          :columnDefs="analyticsColumns"
          :rowData="analyticsRows"
          :cellValueChanged="trySubmitOrUpdateGrade"/>
        </div>
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
  </div>
</template>

<script>
// import data from '../Courses/CourseListDataMock';
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import urljoin from 'url-join';
import { AgGridVue } from 'ag-grid-vue';
import customCellEditor from '../customCellEditor';
import customValueParser from '../customValueParser';
import SectionEnrollmentModalForm from './SectionEnrollmentModal.vue';
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
    EventBus.$on('screw-it-reload-everything', this.fetchData);
  },

  beforeDestroy() {
    // Unsubscribed. Downvoted.
    EventBus.$off('asscat-added', this.asscatAdded);
    EventBus.$off('asscat-updated', this.asscatUpdated);
    EventBus.$off('asscat-removed', this.asscatRemoved);
    EventBus.$off('assignment-added', this.assignmentAdded);
    EventBus.$off('assignment-updated', this.assignmentUpdated);
    EventBus.$off('assignment-removed', this.assignmentRemoved);
    EventBus.$off('enrolled-in-this-section', this.enrolledInThisSection);
    EventBus.$off('unenrolled-in-this-section', this.unenrolledInThisSection);
    EventBus.$off('screw-it-reload-everything', this.fetchData);
  },

  data() {
    // Javascript doesn't allow us to reference other objects in our object, so
    //  we create a self-initializing object to manually assign the references after
    //  creation.

    const data = {
      activeTab: 0,
      section: null,
      allStudents: [],
      students: [],
      assCats: [],
      assignments: [],
      gradesIsVisible: false,
      selectedStudent: null,
      selectedAssignmentCategory: null,
      selectedAssignment: null,
      isEnrollmentModalActive: false,
      isCopyModalActive: false,
      showAnalytics: false,
      gridApi: null,
      columnApi: null,

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

      enrollmentModalInputs: {
        crudTarget: EnrollmentCrud,
        preCreate: null,
        preDelete: null,
        spicyDeletion: true,
        templates: {
          studentId: {
            label: 'Student',
            type: 'filteredDropdown',
            getData: null,
            value: 'id',
            key: 'id',
            display: option => `${option.lastName}, ${option.firstName}`,
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
            label: 'Due Date', type: 'datepicker', placeholder: Date.now(),
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

        // Enrollment inputs
        this.enrollmentModalInputs.templates.studentId.getData = () => {
          // Only allow enrollment of students that aren't already enrolled.
          const filter = (s) => this.students.findIndex(a => a.id === s.id) === -1;
          return this.allStudents.filter(filter);
        };
        this.enrollmentModalInputs.preCreate = (staged) => {
          const sectionId = this.section.id;
          return Object.assign({ sectionId }, staged);
        };
        this.enrollmentModalInputs.postCreate = () => {
          // THIS IS EXPENSIVE, BUT IT'S EASY TO DO HERE compared to the ALTERNATIVE.
          EventBus.$emit('screw-it-reload-everything');
        };
        this.enrollmentModalInputs.preDelete = () => {
          const sectionId = this.section.id;
          const studentId = this.selectedStudent.id;
          return { sectionId, studentId };
        };
        this.enrollmentModalInputs.postDelete = () => {
          // THIS IS EXPENSIVE, BUT IT'S EASY TO DO HERE compared to the ALTERNATIVE.
          EventBus.$emit('screw-it-reload-everything');
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
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    OnExport() {
      this.gridApi.exportDataAsCsv({
        columnDefs: this.assignmentColumns,
        fileName: 'Test',
      });
    },

    // Do grade stuff
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
        await this.updateGrades(gradeArgs);
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

    // async updateStudentGrade(assignment) {
    //   const assIndex = this.assignments.findIndex(a => a.id === assignment.assignmentId);
    //   const
    // },

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
    async enrolledInThisSection(studentId) {
      const student = (await StudentCrud.get(studentId)).data;
      await this.getFilteredGrades(student);
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
      this.assCats.splice(this.assCats.findIndex(a => a.id === assCat.id), 1, assCat);
    },
    asscatRemoved(assCat) {
      this.assCats = this.assCats.filter(a => a.id !== assCat.id);
      EventBus.$emit('screw-it-reload-everything');
    },


    // assignment stuff
    assignmentAdded(assignment) {
      const asscat = this.assCats.find(a => a.id === assignment.assignmentCategoryId);
      asscat.assignments.push(assignment);
      // Add an assignment category to the object, because we lazy up in here.
      assignment.assignmentCategory = asscat;
      this.assignments.push(assignment);
    },
    assignmentRemoved(assignment) {
      const asscat = this.assCats.find(a => a.id === assignment.assignmentCategoryId);
      asscat.assignments = asscat.assignments.filter(s => s.id !== assignment.id);
      this.assignments = this.assignments.filter(s => s.id !== assignment.id);
    },
    assignmentUpdated(assignment) {
      const finder = (ac) => ac.id === assignment.assignmentCategoryId;
      assignment.assignmentCategory = this.assCats.find(finder);
      this.assignments.splice(this.assignment
        .findIndex(a => a.id === assignment.id), 1, assignment);
    },

    async fetchData() {
      // Get Section:
      this.section = (await SectionCrud.get(this.$route.params.sectionId)).data;
      // Get students.
      const rawStudents = (await this.sectionStudentCrud.get()).data; // Get all students in section
      rawStudents.forEach(stud => { stud.grades = []; });
      this.students = rawStudents;


      // Get assignment category information.
      const rawAssCats = (await this.assignmentCategoryCrud.get()).data;
      rawAssCats.forEach(ac => { ac.assignments = []; });
      this.assCats = rawAssCats;

      // Get assignments from said categories.
      const assPromises = rawAssCats.map(async (ac) => {
        const newUrl = urljoin(String(ac.id), '/assignments');
        const asscatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
        const assignments = (await asscatAssCrud.get()).data;
        assignments.forEach((a) => {
          a.grades = [];
          a.assignmentCategory = ac;
          a.dueDate = new Date(Date.parse(a.dueDate));
          this.assignments.push(a);
        });
        ac.assignments = assignments;
      });
      await Promise.all(assPromises);

      // Get grade info from said student.

      const promises = this.students.map(async (s) => {
        await this.getFilteredGrades(s);
      });

      const promises1 = this.assignments.map(async (a) => {
        await this.getAssignmentGrades(a);
      });

      await Promise.all(promises.concat(promises1));

      this.allStudents = (await StudentCrud.get()).data;
    },
    async updateGrades(gradeArgs) {
      const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(gradeArgs.studentId), '/grades'));
      const rawStudentGrades = (await studentGradeCrud.get()).data;
      const grade = Object.assign({}, rawStudentGrades
        .find(g => g.assignmentId === gradeArgs.assignmentId));
      const oldGrade = this.students
        .find(s => s.id === gradeArgs.studentId).grades
        .find(g => g.id === grade.id);
      if (oldGrade) {
        grade.assignment = Object.assign({}, oldGrade.assignment);
        const gradeArray = this.students.find(s => s.id === gradeArgs.studentId).grades;
        gradeArray.splice(gradeArray.findIndex(g => g.id === grade.id), 1, grade);
      } else {
        grade.assignment = Object.assign({}, this.assignments
          .find(a => a.id === gradeArgs.assignmentId));
        grade.assignment.assignmentCategory = Object.assign({}, this.assCats
          .find(ac => ac.id === grade.assignment.assignmentCategoryId));
        const gradeArray = this.students.find(s => s.id === gradeArgs.studentId).grades;
        gradeArray.push(grade);
      }
    },
    getLetterGrade(grade) {
      const A = this.section.gradeScaleA;
      const B = this.section.gradeScaleB;
      const C = this.section.gradeScaleC;
      const D = this.section.gradeScaleD;
      let letterGrade = '';
      if (grade >= A) {
        letterGrade = 'A';
      } else if (grade < A && grade >= B) {
        letterGrade = 'B';
      } else if (grade < B && grade >= C) {
        letterGrade = 'C';
      } else if (grade < C && grade >= D) {
        letterGrade = 'D';
      } else if (grade < D) {
        letterGrade = 'F';
      } else if (grade === 'None') {
        letterGrade = '';
      }
      return letterGrade;
    },
  },

  computed: {
    formattedData() {
      const students = this.students.map(s => {
        const AssCats = [];
        const assignments = [];
        const stud = Object.assign({}, s);
        s.grades.forEach(g => {
          if (!assignments.find(a => a.id === g.assignment.id)) {
            const a = Object.assign({}, g.assignment);
            delete a.assignmentCategory;
            assignments.push(a);
            if (!AssCats.find(ac => ac.id === g.assignment.assignmentCategoryId)) {
              AssCats.push(Object.assign({}, g.assignment.assignmentCategory));
            }
          }
        });
        assignments.map(a => {
          a.grade = Object.assign({}, s.grades.find(g => g.assignmentId === a.id));
          delete a.grade.assignment;
          return a;
        });
        AssCats.map(ac => {
          ac.assignments = assignments.filter(a => a.assignmentCategoryId === ac.id);
          return ac;
        });
        stud.assCats = AssCats;
        return stud;
      });
      return students;
    },
    studentCatAverage() {
      // const formattedStudents = Object.assign({}, this.formattedData);
      const shallowStudents = Object.assign([], this.students);
      this.formattedData.map(student => {
        const studAC = student.assCats.map(asscat => {
          const ac = Object.assign({}, asscat);
          ac.assignments
            .sort((a, b) => {
              // console.log('a', a, 'b', b);
              const aScore = a.grade.score / a.totalPoints;
              const bScore = b.grade.score / b.totalPoints;
              if (aScore < bScore) {
                return -1;
              } if (aScore > bScore) {
                return 1;
              }
              return 0;
            });

          if (ac.assignments && ac.assignments.length > Number(ac.lowestGradesDropped)) {
            let totalPossible = 0;
            let actualTotal = 0;
            for (let i = Number(ac.lowestGradesDropped); i < ac.assignments.length; i += 1) {
              totalPossible += ac.assignments[i].totalPoints;
              actualTotal += ac.assignments[i].grade.score;
            }
            ac.categoryAverage = actualTotal / totalPossible;
          } else ac.categoryAverage = NaN;

          return ac;
        });
        let grade = 0;
        // calculate the weights based on assignment categories
        let hasGrades = false;
        let catWeightsTotal = 0;
        studAC.forEach(ac => {
          if (!Number.isNaN(ac.categoryAverage)) {
            hasGrades = true;
            catWeightsTotal += ac.weight;
          }
        });
        const catWeights = {};
        studAC.forEach(assCat => {
          catWeights[assCat.id] = assCat.weight / catWeightsTotal;
        });
        // use the catWeights and catAverage to get overall grade
        studAC.forEach(ac => {
          if (!Number.isNaN(ac.categoryAverage)) {
            grade += ac.categoryAverage * catWeights[ac.id];
          }
        });
        grade = Number(grade * 100).toFixed(2);
        if (!hasGrades) {
          studAC.overallAverage = 'None';
        } else {
          studAC.overallAverage = grade;
        }
        studAC.studentId = student.id;
        shallowStudents.find(s => s.id === studAC.studentId).overallAverage = studAC.overallAverage;

        return studAC;
      });

      return shallowStudents;
    },
    gradeTableHeight() {
      return (this.showAnalytics) ? '49vh' : '70vh';
    },
    assignmentColumns() {
      return [
        {
          headerName: 'Student ID',
          field: 'studentId',
          pinned: 'left',
          hide: true,
        },
        {
          headerName: 'Student',
          field: 'studentName',
          pinned: 'left',
          editable: false,
        }].concat(
        this.assignments.map(a => ({
          headerName: `${a.name} (${a.totalPoints})`,
          field: `Ass${a.id}`,
          editable: true,
          assignmentId: a.id,
          cellEditor: customCellEditor,
          valueSetter: customValueParser,
          maxScore: a.totalPoints,
          cellStyle: (params) => {
            if (params.value > params.colDef.maxScore && params.value !== 'Unsubmitted') {
              return { backgroundColor: '#FFDD57' };
            }
            return null;
          },
        })),
      );
    },
    categoryWeights() {
      let catWeightsTotal = this.assCats.forEach(ac => {
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
    studentGradeRows() {
      const rows = this.students.map(student => {
        const data = {
          studentId: student.id,
          studentName: `${student.lastName}, ${student.firstName}`,
        };
        this.assignments.forEach(ass => {
          const assString = `Ass${ass.id}`;
          const grade = student.grades.find(g => g.assignmentId === ass.id);
          data[assString] = (grade) ? grade.score : 'Unsubmitted';
          data[`${assString}Link`] = grade;
        });
        return data;
      });
      return rows;
    },
    analyticsColumns() {
      return [
        {
          headerName: 'Operation',
          field: 'opname',
          pinned: 'left',
          editable: false,
        },
      ].concat(
        this.assignments.map(a => ({
          headerName: a.name,
          field: `Ass${a.id}`,
          editable: false,
          assignmentId: a.id,
        })),
      );
    },
    analyticsRows() {
      const filter = g => !Number.isNaN(Number(g.score));
      let ops = [
        { opname: 'Mean', function: QuickMaffs.Mean },
        { opname: 'Median', function: QuickMaffs.Median },
        { opname: 'Mode', function: QuickMaffs.Mode },
        { opname: 'Std. Dev.', function: QuickMaffs.StandardDeviation },
      ];
      ops = ops.map(op => {
        this.assignments.forEach(ass => {
          try {
            const rawScores = ass.grades.filter(filter).map(g => g.score);
            op[`Ass${ass.id}`] = op.function(
              rawScores,
            );
            if (Number.isNaN(op[`Ass${ass.id}`])) op[`Ass${ass.id}`] = 'None';
          } catch (err) {
            op[`Ass${ass.id}`] = 'None';
          }
        });
        return op;
      });
      return ops;
    },
  },
};
</script>
