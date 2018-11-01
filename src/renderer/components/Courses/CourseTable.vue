<template>
  <div>
    <b-table
        :data="courses"
        paginated
        per-page="5"
        detailed
        detail-key="id"
    >

      <template slot-scope="Courseprops">
        <b-table-column field="id" label="Course ID" width="130" sortable>
          {{ Courseprops.row.id }}
        </b-table-column>
        <b-table-column field="title" label="Course Title" sortable>
          {{ Courseprops.row.title }}
        </b-table-column>

        <b-table-column field="sections.length" label="Number of Sections" numeric>
          {{ Courseprops.row.sections.length }}
        </b-table-column>

        <!-- <b-table-column field="CourseAvg" label="Course Average" sortable>
          {{ props.row.CourseAvg }}
        </b-table-column> -->
        <b-table-column label="Course Page">
          <button class="button is-warning is-small">
            <router-link :to="'courses/' + Courseprops.row.id">
              <b-icon type="is-accent" icon="expand-all"/>
            </router-link>
          </button>
        </b-table-column>
      </template>
     </b-table>


      <template slot="detail" slot-scope="Courseprops">
        <b-table
          :data="courses[0].sections"
        >
          <template slot-scope="props">
            <b-table-column field="id" label="Section ID" width="180" sortable>
              {{ props.row.id }}
            </b-table-column>

            <b-table-column field="sectionNumber" label="Section Number" sortable>
              {{ props.row.sectionNumber }}
            </b-table-column>

            <!-- <b-table-column field="NumStudents" label="Number of Students" numeric>
              {{ props.row.NumStudents }}
            </b-table-column>

            <b-table-column field="SectionAvg" label="Section Average" sortable>
              {{ props.row.SectionAvg }}
            </b-table-column> -->

            <b-table-column label="Section Page">
              <button class="button is-warning is-small">
                <router-link :to="'courses/' + Courseprops.row.CourseId + '/' + props.row.sectionNumber">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
            </b-table-column>
          </template>

        </b-table>
      </template>
        <button class="button is-primary is-medium"
          @click="Out(); isModalActive = true">
          Create Course
        </button>
        <b-modal :active.sync="isModalActive" has-modal-card>
          <create-course-form></create-course-form>
        </b-modal>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
// import data from './CourseListDataMock';
import { CourseCrud, TermCrud, SectionCrud } from '../../../../middleware';
import CreateCourseForm from './CreateCourseModal.vue';


export default {
  name: 'courses',

  created() {
    this.fetchData();
  },

  data() {
    return {
      isModalActive: false,
      courses: [],
    };
  },
  components: {
    CreateCourseForm,
  },
  watchers: {

  },
  methods: {
    async fetchData() {
      // TESTING AND SETUP CODE.
      const term = await TermCrud.post({ title: 'TestTerm' });
      let course = await CourseCrud.post({ title: 'TestCourse', courseNo: 42 });
      await SectionCrud.post({
        sectionNumber: 0,
        termId: term.data.id,
        courseId: course.data.id,
      });
      await SectionCrud.post({
        sectionNumber: 1,
        termId: term.data.id,
        courseId: course.data.id,
      });
      course = await CourseCrud.post({ title: 'TestCourse2', courseNo: 43 });
      await SectionCrud.post({
        sectionNumber: 0,
        termId: term.data.id,
        courseId: course.data.id,
      });
      await SectionCrud.post({
        sectionNumber: 1,
        termId: term.data.id,
        courseId: course.data.id,
      });

      const newCourses = (await CourseCrud.get()).data; // Get all courses
      const promises = newCourses.map(async (c) => {
        const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(c.id), '/sections'));
        c.sections = (await courseSectionCrud.get()).data;
      });
      await Promise.all(promises);
      this.courses = newCourses;
    },
    Out() {
      console.log(this.courses);
    },
    getSection(courseID) {
      const section = this.courses.find(s => s.sections.courseId === courseID);
      console.log(section);
      return section;
    },
  },
};
</script>

