<template>
  <div>
    <b-table
        :data="courses"
        paginated
        per-page="5"
        detailed
        detail-key="id"
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
              @click="isSectionModalActive = true; selectedCourseId = props.row.id"
          >
            <b-icon type="is-success" icon="account"/>
          </button>
          <b-modal :active.sync="isSectionModalActive" :width="640" scroll="keep" has-modal-card>
            <create-section-form :course-id="selectedCourseId"></create-section-form>
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
                <router-link :to="'courses/' + props.row.CourseId + '/' + props.row.SectionName">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
            </b-table-column>
          </template>

        </b-table>
      </template>
    </b-table>

    <button class="button is-primary is-medium"
      @click="isCourseModalActive = true">
      Create Course
    </button>
    <b-modal :active.sync="isCourseModalActive" has-modal-card>
      <create-course-form></create-course-form>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
// import data from './CourseListDataMock';
import { CourseCrud, EventBus } from '../../../../middleware';
import CreateCourseForm from './CreateCourseModal.vue';
import CreateSectionForm from './CreateSectionModal.vue';


export default {
  name: 'courses',

  created() {
    this.fetchData();
    EventBus.$on('course-added', this.courseAdded);
    EventBus.$on('course-removed', this.courseRemoved);
    EventBus.$on('section-added', this.sectionAdded);
    EventBus.$on('section-removed', this.sectionAdded);
  },
  beforeDestroy() {
    EventBus.$off('course-added', this.courseAdded);
    EventBus.$off('course-removed', this.courseRemoved);
    EventBus.$off('section-added', this.sectionAdded);
    EventBus.$off('section-removed', this.sectionAdded);
  },

  data() {
    return {
      selectedCourseId: null,
      isCourseModalActive: false,
      isSectionModalActive: false,
      courses: [],
    };
  },
  components: {
    CreateCourseForm,
    CreateSectionForm,
  },
  methods: {
    courseAdded(course) { this.courses.push(course); },
    courseRemoved(course) { this.courses = this.courses.filter(c => c.id === course.id); },
    sectionAdded(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections.push(section);
    },
    sectionRemoved(section) {
      const course = this.courses.find(c => c.id === section.courseId);
      course.sections.filter(s => s.id === section.id);
    },

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

