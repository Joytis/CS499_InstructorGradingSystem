<template>
  <div>
    <crud-modal-bar
      createTitle="Create Course"
      editTitle="Edit Course"
      deleteTitle="Delete Course"
      deleteMessage="Are you sure? This will delete: ALL SECTIONS"
      :target="selectedCourse"
      :inputs="courseModalInputs"
    />
    <b-table
        :data="courses"
        paginated
        per-page="5"
        detailed
        detail-key="id"
        :selected.sync="selectedCourse"
    >

      <template slot-scope="props">
        <b-table-column field="courseId" label="Course ID" width="130" sortable>
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="title" label="Course Title" sortable>
          {{ `${props.row.courseLabel} - ${props.row.title}` }}
        </b-table-column>

        <b-table-column field="courseSections" label="Number of Sections" numeric>
          {{ props.row.sections.length }}
        </b-table-column>
        </b-table-column>
        <b-table-column label="Create Section">
          <crud-modal-bar
            @click="selectedCourse = props.row"
            createTitle="Create Section"
            :inputs="sectionModalInputs"
            :removed="['edit', 'delete']"
          />
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <b-table :data=props.row.sections>
          <template slot-scope="props">
            <b-table-column field="SectionName" label="Section Name" width="180" sortable>
              {{ props.row.sectionNumber }}
            </b-table-column>

            <!-- TODO: Add times to sections. -->
            <b-table-column field="SectionTime" label="Section Number" sortable>
              {{ props.row.sectionTime }}
            </b-table-column>

            <b-table-column label="Section Page">
              <button class="button is-warning is-small">
                <router-link :to="'courses/' + props.row.courseId + '/' + props.row.id">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
            </b-table-column>
            <b-table-column label="Modify">
              <crud-modal-bar
                editTitle="Edit"
                deleteTitle="Delete"
                :inputs="sectionModalInputs"
                :target="props.row"
                :removed="['create']"
              />
            </b-table-column>
          </template>
        </b-table>
      </template>
    </b-table>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import CrudModalBar from '../CrudModalBar.vue';
import CreationModalForm from '../CreationModal.vue';
import {
  CourseCrud, SectionCrud, EventBus, Finders,
} from '../../../../middleware';

export default {
  name: 'courses',

  components: {
    CrudModalBar,
    CreationModalForm,
  },

  created() {
    this.fetchData();
    EventBus.$on('term-swapped', this.fetchData); // Just reinitialize.
    EventBus.$on('course-added', this.courseAdded);
    EventBus.$on('course-removed', this.courseRemoved);
    EventBus.$on('course-updated', this.courseUpdated);
    EventBus.$on('section-added', this.sectionAdded);
    EventBus.$on('section-removed', this.sectionRemoved);
  },
  beforeDestroy() {
    EventBus.$off('term-swapped', this.fetchData);
    EventBus.$off('course-added', this.courseAdded);
    EventBus.$off('course-removed', this.courseRemoved);
    EventBus.$off('course-updated', this.courseUpdated);
    EventBus.$off('section-added', this.sectionAdded);
    EventBus.$off('section-removed', this.sectionRemoved);
  },
  data() {
    const data = {
      selectedCourse: null,
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      isSectionModalActive: false,

      courses: [],
      // Arguments passed into the creation modal for courses.
      courseModalInputs: {
        crudTarget: CourseCrud,
        postCreate(result) { EventBus.$emit('course-added', result); },
        postUpdate(result) { EventBus.$emit('course-updated', result); },
        postDelete(result) { EventBus.$emit('course-removed', result); },
        templates: {
          courseLabel: { label: 'Course Label', type: 'input', placeholder: 'CS100' },
          title: { label: 'Course Title', type: 'input', placeholder: 'Intro to Code' },
        },
      },
      // Arguments passed into Creation modal for sections
      sectionModalInputs: {
        crudTarget: SectionCrud,
        preCreate: null,
        postCreate(result) { EventBus.$emit('section-added', result); },
        postDelete(result) { EventBus.$emit('section-removed', result); },
        templates: {
          sectionNumber: {
            label: 'Section Number', type: 'input', subtype: 'number', placeholder: '00',
          },
          gradeScaleA: {
            label: 'Grade Scale: A (Out of 100)', type: 'input', subtype: 'number', placeholder: '90',
          },
          gradeScaleB: {
            label: 'Grade Scale: B (Out of 100)', type: 'input', subtype: 'number', placeholder: '80',
          },
          gradeScaleC: {
            label: 'Grade Scale: C (Out of 100)', type: 'input', subtype: 'number', placeholder: '70',
          },
          gradeScaleD: {
            label: 'Grade Scale: D (Out of 100)', type: 'input', subtype: 'number', placeholder: '60',
          },

        },
      },
      init() {
        this.sectionModalInputs.preCreate = async (staged) => {
          // Retrieve the desired course and term ID
          // Querying events here because we don't have access to other members in data asection.
          const courseId = this.selectedCourse.id;
          const termId = (await Finders.SelectedTerm()).id;
          const instructorId = (await Finders.CurrentInstructor()).id;
          return Object.assign({ courseId, termId, instructorId }, staged);
        };
      },
    };
    data.init();
    return data;
  },
  methods: {
    async courseAdded(course) {
      const custom = Object.assign({ sections: [] }, course);
      const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(custom.id), '/sections'));
      custom.sections = (await courseSectionCrud.get()).data;
      this.courses.push(custom);
    },
    courseRemoved(course) { this.courses = this.courses.filter(c => c.id !== course.id); },
    courseUpdated(course) {
      this.courses[this.courses.findIndex(c => c.id === course.id)] = course;
    },

    // Section stuff.
    sectionAdded(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections.push(section);
    },
    sectionRemoved(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections = course.sections.filter(s => s.id !== section.id);
    },

    async fetchData() {
      const newCourses = (await CourseCrud.get()).data; // Get all courses
      const promises = newCourses.map(async (c) => {
        const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(c.id), '/sections'));
        const sections = (await courseSectionCrud.get()).data;
        const instructor = await Finders.CurrentInstructor();
        const term = await Finders.SelectedTerm();
        const filter = sec => (sec.instructorId === instructor.id) && (sec.termId === term.id);
        c.sections = sections.filter(filter);
      });
      await Promise.all(promises);
      this.courses = newCourses;
    },
    Out() {
      console.log(this.courses);
    },
    getSection(courseID) {
      const section = this.courses.find(s => s.sections.courseId === courseID);
      return section;
    },
  },
};
</script>

