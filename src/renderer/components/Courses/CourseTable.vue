<template>
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
        {{ props.row.title }}
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

    </template>

    <template slot="detail" slot-scope="props">
      <b-table
        :data=props.row.sections
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
            <button class="button is-warning is-small">+</button>
          </b-table-column>
        </template>

      </b-table>
    </template>
  </b-table>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
// import data from './CourseListDataMock';
import { CourseCrud, TermCrud, SectionCrud } from '../../../../middleware';


export default {
  name: 'courses',

  created() {
    this.fetchData();
  },

  data() {
    return {
      courses: [],
    };
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
  },
};
</script>

