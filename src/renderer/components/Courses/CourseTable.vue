<template>
  <div>
    <b-table
        :data="courses"
        paginated
        per-page="5"
        detailed
        detail-key="CourseId"
    >

      <template slot-scope="props">
        <b-table-column field="courseId" label="Course ID" width="130" sortable>
          {{ props.row.CourseId }}
        </b-table-column>
        <b-table-column field="courseName" label="Course Title" sortable>
          {{ props.row.CourseName }}
        </b-table-column>

        <b-table-column field="courseSections" label="Number of Sections" numeric>
          {{ props.row.CourseSections }}
        </b-table-column>

        <!-- <b-table-column field="CourseAvg" label="Course Average" sortable>
          {{ props.row.CourseAvg }}
        </b-table-column> -->
        <b-table-column label="Course Page">
          <button class="button is-warning is-small">
            <router-link :to="'courses/' + props.row.CourseId">
              <b-icon type="is-accent" icon="expand-all"/>
            </router-link>
          </button>
        </b-table-column>
      </template>
     </b-table>


      <template slot="detail" slot-scope="props">
        <b-table
          :data=getSection(props.row.CourseId)
        >
          <template slot-scope="props">
            <b-table-column field="SectionName" label="Section ID" width="180" sortable>
              {{ props.row.SectionName }}
            </b-table-column>

            <b-table-column field="SectionTime" label="Section Number" sortable>
              {{ props.row.SectionTime }}
            </b-table-column>

            <!-- <b-table-column field="NumStudents" label="Number of Students" numeric>
              {{ props.row.NumStudents }}
            </b-table-column>

            <b-table-column field="SectionAvg" label="Section Average" sortable>
              {{ props.row.SectionAvg }}
            </b-table-column> -->

            <b-table-column label="Section Page">
              <button class="button is-warning is-small">
                <router-link :to="'courses/' + Courseprops.row.CourseId + '/' + props.row.SectionName">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
            </b-table-column>
          </template>

        </b-table>
      </template>
        <button class="button is-primary is-medium"
          @click="modalForm = 'createcourse'; isModalActive = true">
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
import data from './CourseListDataMock';
import { CourseCrud } from '../../../../middleware';
import CreateCourseForm from './CreateCourseModal.vue';


export default {
  name: 'courses',

  created() {
    // this.fetchData();
  },
  mounted() {
    this.courses = data.coursedata;
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
  methods: {
    async fetchData() {
      // // TESTING AND SETUP CODE.
      // const term = await TermCrud.post({ title: 'TestTerm' });
      // let course = await CourseCrud.post({ title: 'TestCourse', courseNo: 42 });
      // await SectionCrud.post({
      //   sectionNumber: 0,
      //   termId: term.data.id,
      //   courseId: course.data.id,
      // });
      // await SectionCrud.post({
      //   sectionNumber: 1,
      //   termId: term.data.id,
      //   courseId: course.data.id,
      // });
      // course = await CourseCrud.post({ title: 'TestCourse2', courseNo: 43 });
      // await SectionCrud.post({
      //   sectionNumber: 0,
      //   termId: term.data.id,
      //   courseId: course.data.id,
      // });
      // await SectionCrud.post({
      //   sectionNumber: 1,
      //   termId: term.data.id,
      //   courseId: course.data.id,
      // });

      const newCourses = (await CourseCrud.get()).data; // Get all courses
      const promises = newCourses.map(async (c) => {
        const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(c.id), '/sections'));
        c.sections = (await courseSectionCrud.get()).data;
      });
      await Promise.all(promises);
      this.courses = newCourses;
    },
    getSection(courseid) {
      const section = this.data.find(s => s.CourseId === courseid).Section;
      return section;
    },
  },
};
</script>

