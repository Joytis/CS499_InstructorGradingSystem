<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <back-button/>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary is-small" @click="out(assignmentsTableRows)">
            Ass
          </button>
        </div>
        <div class="level-item">
          <button class="button is-primary is-small" @click="out(section)">
            Section
          </button>
        </div>
      </div>
    </nav>
    <section>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Student Averages">
          <ag-grid-vue v-if="!loading" 
            style="width: 100%; height: 70vh;"
            class="ag-theme-balham"
            :columnDefs="assCatColumns"
            :rowData="assCatRows"
            />
        </b-tab-item>
        <b-tab-item label="Assignments">
          <b-table 
            :data="assignmentsTableRows"
            paginated 
            per-page="5"
            :selected.sync="selectedAssignment"
            >
            <template slot-scope="props">
              <b-table-column field="name" label="Name" sortable>
                {{ props.row.name }}
              </b-table-column>
              <b-table-column field="category" label="Assignment Category" sortable>
                {{ props.row.acName }}
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
        </b-tab-item>
        <b-tab-item label="Section Settings">
          <crud-modal-bar
            createTitle="Create Assignment Category"
            editTitle="Edit Assignment Category"
            deleteTitle="Delete Assignment Category"
            :target="selectedAssignmentCategory"
            :inputs="assignmentCategoryInputs"
            :removed="['edit', 'delete']"
          />

          <!-- Assignment Category Tables -->
          <b-table 
              :data="assignmentCategoryRows" 
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
              <b-table-column>
                <crud-modal-bar
                  @click="selectedAssignment = props.row"
                  editTitle="Edit"
                  deleteTitle="Delete"
                  deleteMessage="Are you sure? This will delete ALL assignments and grades in this category."
                  :inputs="assignmentCategoryInputs"
                  :target="props.row"
                  :removed="['create']"
                />
              </b-table-column>
            </template>
          </b-table>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import urljoin from 'url-join';
import { AtomSpinner, SelfBuildingSquareSpinner } from 'epic-spinners';
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
    AtomSpinner,
    SelfBuildingSquareSpinner,
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
      loading: true,

      changeQueue: {
        AssignmentCategories: {
          New: [],
          Updates: [],
          Deletes: [],
        },
        Assignments: {
          Updates: [],
          Deletes: [],
        },
        GradingScale: {
          Update: {},
        },
        Grades: {
          Updates: [],
          Deletes: [],
        },
      },

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
          this.assignments.push(a);
        });
        ac.assignments = assignments;
      });
      await Promise.all(assPromises);


      // Append assignment categories to each student
      this.section.students.forEach(stud => {
        stud.assCats = JSON.parse(JSON.stringify(this.rawAssCats));
      });

      // Calculate indices once to avoid doing comps for each student
      // If there are assignments, map the correct grade to each student
      if (this.section.students
        && this.section.students[0]
        && this.section.students[0].assCats[0]
        && this.section.students[0].assCats[0].assignments
        && this.section.students[0].assCats[0].assignments[0]) {
        this.section.students[0].assCats.forEach((ac, acind) => {
          ac.assignments.forEach((a, aind) => {
            this.indices[`IndexOf${a.id}`] = {
              aIndex: aind,
              acIndex: acind,
            };
          });
        });

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

        this.loading = false;
      }

    //   const promises1 = this.assignments.map(async (a) => {
    //     await this.getAssignmentGrades(a);
    //   });

    //   await Promise.all(promises.concat(promises1));

    //   this.allStudents = (await StudentCrud.get()).data;
    },
    updateGS: (GS) => {
      this.section.gradeScaleA = GS.gradeScaleA;
      this.section.gradeScaleB = GS.gradeScaleB;
      this.section.gradeScaleC = GS.gradeScaleC;
      this.section.gradeScaleD = GS.gradeScaleD;
      this.changeQueue.GradingScale.Update = GS;
    },
    newAC: (AC) => {
      // GENERATE NEW AC.ID FOR ASSIGNMENTS TO REFERENCE!!
      // PARSE IT!!
      AC.new = true,
      this.rawAssCats.push(AC);
      this.section.students.forEach(s => s.assCats.push(AC));
      this.changeQueue.AssignmentCategories.New.push(AC);
    },
    updateAC: (AC) => {
      AC.assignments = this.rawAssCats.find(oldAC => oldAC.id === AC.id).assignments;
      AC.assignments.forEach(a => {
        a.assignmentCategoryId = AC.id;
      });
      this.rawAssCats.splice(this.rawAssCats.findIndex(oldAC => oldAC.id === AC.id), 1, JSON.parse(JSON.stringify(AC)));
      this.section.students.forEach(s => {
        const newAC = JSON.parse(JSON.stringify(AC));
        newAC.assignments = s.assCats.find(ac => newAC.id === ac.id).assignments;
        newAC.assignments.forEach(a => {
          a.assignmentCategoryId = newAC.id
        });
        s.assCats.splice(s.assCats.findIndex(ac => ac.id === newAC.id), 1, newAC);
      });
    
      if(AC.new) {
        
      } else {
        // don't
      }
    }, 
    deleteAC: (AC) => {

    },
    updateAss: (a) => {

    },
    deleteAss: (a) => {

    },
    updateGrade: (g) => {

    },
    deleteGrade: (g) => {

    },
  },
  computed: {
    assignmentCategoryRows() {
      return this.rawAssCats;
    },
    assignmentsTableRows() {
      let assignments1 = [];
      this.rawAssCats.forEach(ac => {
        ac.assignments.forEach(a => {
          a.acName = ac.name;
        });
        assignments1 = assignments1.concat(ac.assignments);
      });
      console.log(assignments1);
      return assignments1;
    },
    assCatColumns() {
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
        this.section.students[0].assCats.map(ac => ({
          headerName: ac.name,
          field: `AC${ac.id}`,
          editable: false,
          // assCatId: ac.id,
        })),
      );
    },
    assCatRows() {
      const rows = this.section.students.map(student => {
        const data = {
          studentId: student.id,
          studentName: `${student.lastName}, ${student.firstName}`,
        };
        student.assCats.forEach(ac => {
          ac.assignments = ac.assignments
            .filter(a => typeof (a.grade) !== 'undefined' && typeof (a.grade.score) === 'number')
            .sort((a, b) => {
              const aScore = a.grade.score / a.totalPoints;
              const bScore = b.grade.score / b.totalPoints;
              if (aScore < bScore) {
                return -1;
              } if (aScore > bScore) {
                return 1;
              }
              return 0;
            });

          if (ac.assignments && ac.assignments.length > ac.lowestGradesDropped) {
            let totalPossible = 0;
            let actualTotal = 0;
            for (let i = ac.lowestGradesDropped; i < ac.assignments.length; i += 1) {
              totalPossible += ac.assignments[i].totalPoints;
              actualTotal += ac.assignments[i].grade.score;
            }
            ac.categoryAverage = actualTotal / totalPossible;
          } else ac.categoryAverage = NaN;

          data[`AC${ac.id}`] = (!Number.isNaN(ac.categoryAverage)) ? `${Number(ac.categoryAverage * 100).toFixed(2)}%` : 'None';
        });
        return data;
      });
      return rows;
    },
  },
};
</script>
