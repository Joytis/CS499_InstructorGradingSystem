<template>
  <div>
    <button class="button is-primary is-small"@click="isCreationModalActive = true"> 
      Create New Course
    </button>
    <button class="button is-warning is-small" @click="isEditThingsModalActive = true" :disabled="!selectedCourse">
      Edit Course
    </button>
    <b-modal :active.sync="isCreationModalActive" :width="640" scroll="keep" has-modal-card>
      <creation-modal-form :inputs="courseModalInputs"></creation-modal-form>
    </b-modal>
    <b-modal :active.sync="isEditThingsModalActive" :width="640" scroll="keep" has-modal-card>
      <edit-things-modal-form :inputs="courseModalInputs" :target="selectedCourse"></edit-things-modal-form>
    </b-modal>

    <b-table
        :data="courses"
        paginated
        per-page="5"
        detailed
        detail-key="id"
        :selected.sync="selectedCourse"
    >

      <template slot-scope="props">
        <b-table-column field="id" label="Course ID" width="130" sortable>
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="title" label="Course Title" sortable>
          {{ `${props.row.courseLabel} - ${props.row.title}` }}
        </b-table-column>

        <b-table-column field="sections.length" label="Number of Sections" numeric>
          {{ props.row.sections.length }}
        </b-table-column>

        <!-- <b-table-column field="CourseAvg" label="Course Average" sortable>
          {{ props.row.CourseAvg }}
        </b-table-column> -->
        <b-table-column label="Course Page">
          <button class="button is-warning is-small">
            <router-link :to="'courses/' + props.row.id">
              <b-icon type="is-accent" icon="expand-all"/>
            </router-link>
          </button>
        </b-table-column>
        <b-table-column label="Create Section">
          <button 
              class="button is-warning is-small" 
              @click="selectedCourse = props.row; isSectionModalActive = true"
          >
            <b-icon type="is-success" icon="account"/>
          </button>
          <b-modal :active.sync="isSectionModalActive" :width="640" scroll="keep" has-modal-card>
            <creation-modal-form :inputs="sectionModalInputs"></creation-modal-form>
          </b-modal>
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <b-table :data=props.row.sections>
          <template slot-scope="props">
            <b-table-column field="id" label="Section ID" width="180" sortable>
              {{ props.row.id }}
            </b-table-column>

            <b-table-column field="sectionNumber" label="Section Number" sortable>
              {{ props.row.sectionNumber }}
            </b-table-column>

            <b-table-column label="Section Page">
              <button class="button is-warning is-small">
                <router-link :to="'courses/' + props.row.courseId + '/' + props.row.id">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
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
import CreationModalForm from '../CreationModal.vue';
import EditThingsModalForm from '../EditThingsModal.vue';
import {
  CourseCrud, SectionCrud, EventBus, Finders,
} from '../../../../middleware';

export default {
  name: 'courses',

  components: {
    CreationModalForm,
    EditThingsModalForm,
  },

  created() {
    this.fetchData();
    EventBus.$on('course-added', this.courseAdded);
    EventBus.$on('course-removed', this.courseRemoved);
    EventBus.$on('course-updated', this.courseUpdated);
    EventBus.$on('section-added', this.sectionAdded);
    EventBus.$on('section-removed', this.sectionAdded);
    EventBus.$on('request-selected-course', this.requestSelectedCourse);
  },
  beforeDestroy() {
    EventBus.$off('course-added', this.courseAdded);
    EventBus.$off('course-removed', this.courseRemoved);
    EventBus.$off('course-updated', this.courseUpdated);
    EventBus.$off('section-added', this.sectionAdded);
    EventBus.$off('section-removed', this.sectionAdded);
    EventBus.$off('request-selected-course', this.requestSelectedCourse);
  },

  data() {
    return {
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
        templates: {
          courseLabel: { label: 'Course Label', type: 'input', placeholder: 'CS100' },
          title: { label: 'Course Title', type: 'input', placeholder: 'Intro to Code' },
        },
      },
      // Arguments passed into Creation modal for sections
      sectionModalInputs: {
        crudTarget: SectionCrud,
        async preCreate(staged) {
          // Retrieve the desired course and term ID
          // Querying events here because we don't have access to other members in data asection.
          const courseId = (await Finders.SelectedCourse()).id;
          const termId = (await Finders.SelectedTerm()).id;
          return Object.assign({ courseId, termId }, staged);
        },
        postCreate(result) { EventBus.$emit('section-added', result); },
        templates: {
          sectionNumber: {
            label: 'Section Number', type: 'input', subtype: 'number', placeholder: '00',
          },
        },
      },
    };
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
    sectionAdded(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections.push(section);
    },
    sectionRemoved(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections.filter(s => s.id !== section.id);
    },

    requestSelectedCourse() { EventBus.$emit('response-selected-course', this.selectedCourse); },
    async fetchData() {
      const newCourses = (await CourseCrud.get()).data; // Get all courses
      const promises = newCourses.map(async (c) => {
        const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(c.id), '/sections'));
        c.sections = (await courseSectionCrud.get()).data;
      });
      await Promise.all(promises);
      this.courses = newCourses;
    },
  },
};
</script>

