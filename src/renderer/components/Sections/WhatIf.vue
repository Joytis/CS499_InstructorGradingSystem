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
          <button class="button is-danger is-small" @click="$router.go(-1)">
            Exit w/o Saving
          </button>
        </div>
        <div class="level-item">
          <button class="button is-primary is-small" @click="flushChangeQueue()">
            Save &amp; Exit
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
            :enableColResize="true"
            :enterMovesDownAfterEdit="true"
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
                  @assignmentdelete="deleteAssignment($event)"
                  @assignmentedit="updateAssignment($event)"
                  :emit-type="'assignment'"
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
          <nav class="level" v-if="!loading">
            <div class="level-item">
              A: 100 - {{section.gradeScaleA}}
            </div>
            <div class="level-item">
              B: &lt;{{section.gradeScaleA}} - {{section.gradeScaleB}}
            </div>
            <div class="level-item">
              C: &lt;{{section.gradeScaleB}} - {{section.gradeScaleC}}
            </div>
            <div class="level-item">
              D: &lt;{{section.gradeScaleC}} - {{section.gradeScaleD}}
            </div>
            <div class="level-item">
              F: &lt;{{section.gradeScaleD}} - 0
            </div>
          </nav>
          <crud-modal-bar
            createTitle="Create Assignment Category"
            editTitle="Edit Assignment Category"
            deleteTitle="Delete Assignment Category"
            @accreate="newAC($event)"
            @acedit="updateAC($event)"
            @acdelete="deleteAC($event)"
            :emit-type="'ac'"
            :target="selectedAssignmentCategory"
            :inputs="assignmentCategoryInputs"
            :removed="['edit', 'delete']"
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
              <b-table-column>
                <crud-modal-bar
                  @click="selectedAssignment = props.row"
                  @acedit="updateAC($event)"
                  @acdelete="deleteAC($event)"
                  editTitle="Edit"
                  deleteTitle="Delete"
                  deleteMessage="Are you sure? This will delete ALL assignments and grades in this category."
                  :emit-type="'ac'"
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
import CrudModalBar from '../QueueModalBar/CrudModalBar.vue';
import {
  SectionCrud, EventBus, AssignmentCategoryCrud, AssignmentCrud, StudentCrud,
  EnrollmentCrud, GradeCrud, // QuickMaffs,
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
    EnrollmentCrud,
    GradeCrud,
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
      students: [],
      assCats: [],
      maxACId: -1,
      assignments: [],
      grades: [],
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
        // postCreate(result) { EventBus.$emit('asscat-added', result); },
        // postUpdate(result) { EventBus.$emit('asscat-updated', result); },
        // postDelete(result) { EventBus.$emit('asscat-removed', result); },
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
            label: 'Total Points', type: 'input', subtype: 'number', placeholder: 100, min: 1,
          },
          dueDate: {
            label: 'Due Date', type: 'datepicker', placeholder: Date(Date.now()),
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
      this.students = (await this.sectionStudentCrud.get()).data;

      // Get the assignment categories for the section
      this.assCats = (await this.assignmentCategoryCrud.get()).data;

      this.assCats.forEach(ac => {
        if (ac.id > this.maxACId) this.maxACId = ac.id;
      });

      // Append an array of assignments to the assignment categories
      const assPromises = this.assCats.map(async (ac) => {
        const newUrl = urljoin(String(ac.id), '/assignments');
        const asscatAssCrud = AssignmentCategoryCrud.fromAppendedRoute(newUrl);
        const assignments = (await asscatAssCrud.get()).data;
        assignments.forEach((a) => {
          a.dueDate = new Date(Date.parse(a.dueDate));
          this.assignments.push(a);
        });
      });
      await Promise.all(assPromises);

      // If there are assignments, map the correct grade to each student
      const gradePromises = this.students.map(async (s) => {
        const studentGradeCrud = StudentCrud.fromAppendedRoute(urljoin(String(s.id), '/grades'));
        const rawStudentGrades = (await studentGradeCrud.get()).data;
        rawStudentGrades.forEach(g => this.grades.push(g));
      });
      await Promise.all(gradePromises);

      this.loading = false;
    },

    updateGS(GS) {
      this.section.gradeScaleA = GS.gradeScaleA;
      this.section.gradeScaleB = GS.gradeScaleB;
      this.section.gradeScaleC = GS.gradeScaleC;
      this.section.gradeScaleD = GS.gradeScaleD;
      this.changeQueue.GradingScale.Update = GS;
    },
    newAC(AC) {
      AC.new = true;
      this.maxACId += 1;
      AC.id = this.maxACId;
      this.assCats.push(AC);
      this.changeQueue.AssignmentCategories.New.push(AC);
    },
    updateAC(AC) {
      this.assCats.splice(
        this.assCats.findIndex(ac => ac.id === AC.id),
        1,
        AC,
      );
      if (AC.new) {
        this.changeQueue.AssignmentCategories.New.splice(
          this.changeQueue.AssignmentCategories.New.findIndex(ac => ac.id === AC.id),
          1,
          AC,
        );
      } else {
        const cqIndex = this.changeQueue.AssignmentCategories.Updates
          .findIndex(ac => ac.id === AC.id);
        if (cqIndex >= 0) {
          this.changeQueue.AssignmentCategories.splice(
            cqIndex,
            1,
            Object.assign({}, AC),
          );
        } else this.changeQueue.AssignmentCategories.Updates.push(Object.assign({}, AC));
      }
    },
    deleteAC(AC) {
      if (this.assignments.find(a => a.assignmentCategoryId === AC.id)) {
        this.assignments.filter(a => a.assignmentCategoryId === AC.id).forEach(a => {
          this.grades.filter(g => g.assignmentId === a.id).forEach(g => {
            this.changeQueue.Grades.Deletes.push(Object.assign({}, g));
          });
          this.grades = this.grades.filter(g => g.assignmentId !== a.id);
          this.changeQueue.Assignments.Deletes.push(Object.assign({}, a));
        });
        this.assignments = this.assignments.filter(a => a.assignmentCategoryId !== AC.id);
      }
      if (AC.new) {
        this.changeQueue.AssignmentCategories.New.splice(
          this.changeQueue.AssignmentCategories.New.findIndex(ac => ac.id === AC.id),
          1,
        );
      } else {
        this.changeQueue.AssignmentCategories.Deletes.push(Object.assign({}, AC));
      }
      this.assCats.splice(this.assCats.findIndex(ac => ac.id === AC.id), 1);
    },
    updateAssignment(a) {
      if (this.grades.find(g => g.assignmentId === a.id)) {
        const oldA = this.assignments.find(oa => oa.id === a.id);
        if (oldA.totalPoints !== a.totalPoints) {
          this.grades.filter(g => g.assignmentId === a.id).forEach(g => {
            g.score *= a.totalPoints / oldA.totalPoints;
            const guIndex = this.changeQueue.Grades.Updates.findIndex(gu => gu.id === g.id);
            if (guIndex >= 0) {
              this.changeQueue.Grades.Updates.splice(
                guIndex,
                1,
                Object.assign({}, g),
              );
            } else this.changeQueue.Grades.Updates.push(Object.assign({}, g));
          });
        }
      }
      this.assignments.splice(
        this.assignments.findIndex(oa => oa.id === a.id),
        1,
        Object.assign({}, a),
      );
      const uaIndex = this.changeQueue.Assignments.Updates.findIndex(ua => ua.id === a.id);
      if (uaIndex) this.changeQueue.Assignments.Updates.splice(uaIndex, 1, Object.assign({}, a));
      else this.changeQueue.Assignments.Updates.push(Object.assign({}, a));
    },
    deleteAssignment(a) {
      if (this.grades.find(g => g.assignmentId === a.id)) {
        this.grades.filter(g => g.assignmentId === a.id).forEach(g => {
          this.changeQueue.Grades.Deletes.push(Object.assign({}, g));
        });
        this.grades = this.grades.filter(g => g.assignmentId !== a.id);
      }
      this.changeQueue.Assignments.Deletes.push(Object.assign({}, a));
      this.assignments.splice(this.assignments.findIndex(da => da.id === a.id), 1);
    },
    async flushChangeQueue() {
      const cq = this.changeQueue;
      try {
        if (cq.AssignmentCategories.New.length) {
          const newACPromises = cq.AssignmentCategories.New.map(async (ac) => {
            const oldACId = ac.id;
            ac.weight = Number(ac.weight);
            ac.lowestGradesDropped = Number(ac.lowestGradesDropped);
            ac = (await AssignmentCategoryCrud.post(ac)).data;
            ac.oldId = oldACId;
            cq.Assignments.Updates.forEach(a => {
              if (a.assignmentCategoryId === ac.oldId) a.assignmentCategoryId = ac.id;
            });
          });
          await Promise.all(newACPromises);
        }
        if (cq.GradingScale.Update.id) {
          await SectionCrud.put(cq.GradingScale.Update.id, { data: cq.GradingScale.Update });
        }
        if (cq.AssignmentCategories.Updates.length) {
          const updateACPromises = cq.AssignmentCategories.Updates.map(async (ac) => {
            await AssignmentCategoryCrud.put(ac.id, { data: ac });
          });
          await Promise.all(updateACPromises);
        }
        if (cq.Assignments.Updates.length) {
          const updateAsses = cq.Assignments.Updates.map(async (a) => {
            await AssignmentCrud.put(a.id, { data: a });
          });
          await Promise.all(updateAsses);
        }
        if (cq.Grades.Updates.length) {
          const updateGrades = cq.Grades.Updates.map(async (g) => {
            await GradeCrud.put(g.id, { data: g });
          });
          await Promise.all(updateGrades);
        }
        if (cq.Grades.Deletes.length) {
          const deleteGrades = cq.Grades.Deletes.map(async (g) => {
            await GradeCrud.delete(g.id);
          });
          await Promise.all(deleteGrades);
        }
        if (cq.Assignments.Deletes.length) {
          const deleteAsses = cq.Assignments.Deletes.map(async (a) => {
            await AssignmentCrud.delete(a.id);
          });
          await Promise.all(deleteAsses);
        }
        if (cq.AssignmentCategories.Deletes.length) {
          const deleteACPromises = cq.AssignmentCategories.Deletes.map(async (ac) => {
            await AssignmentCategoryCrud.delete(ac.id);
          });
          await Promise.all(deleteACPromises);
        }
        this.$router.go(-1);
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
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
    mutateAC(ac) {
      ac.totalPoints = 50;
      return ac;
    },
    makeNewAC() {
      return {
        id: Number,
        createdAt: Date(Date.now() - 24 * 60 * 60 * 1000),
        lowestGradesDropped: 1,
        name: 'Bullshit',
        sectionId: this.sectionStructure.id,
        weight: 0.35,
        updatedAt: Date(Date.now()),
      };
    },
    moveAssTo(ass, ac) {
      ass.assignmentCategoryId = ac.id;
      this.updateAssignment(ass);
    },
  },
  computed: {
    assignmentCategoryRows() {
      return Object.assign({}, this.rawAssCats);
    },
    sectionStructure() {
      const section = Object.assign({}, this.section);
      section.students = JSON.parse(JSON.stringify(this.students));
      section.students.forEach(s => {
        s.assCats = JSON.parse(JSON.stringify(this.assCats));
        s.assCats.forEach(ac => {
          ac.assignments = JSON.parse(JSON.stringify(
            this.assignments.filter(a => a.assignmentCategoryId === ac.id),
          ));
          ac.assignments.forEach(a => {
            a.grade = Object.assign(
              {},
              this.grades.find(g => g.assignmentId === a.id && g.studentId === s.id),
            );
          });
        });
      });

      return section;
    },
    assignmentsTableRows() {
      const assignments = JSON.parse(JSON.stringify(this.assignments));
      assignments.forEach(a => {
        a.acName = this.assCats.find(ac => ac.id === a.assignmentCategoryId).name;
      });
      return assignments;
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
        this.assCats.map(ac => ({
          headerName: ac.name,
          field: `AC${ac.id}`,
          editable: false,
          assCatId: ac.id,
        })),
      );
    },
    assCatRows() {
      const rows = this.sectionStructure.students.map(realStudent => {
        const student = Object.assign({}, realStudent);
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
