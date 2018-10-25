<template>
  <div>
      <b-table
          :data="datamock"
          paginated
          per-page="5"
          detailed
          detail-key="CourseId"
      >

          <template slot-scope="props">
            <b-table-column field="CourseId" label="Course ID" width="130" sortable>
              {{ props.row.CourseId }}
            </b-table-column>
            <b-table-column field="CourseName" label="Course Name" sortable>
              {{ props.row.CourseName }}
            </b-table-column>

            <b-table-column field="CourseSections" label="Number of Sections" numeric>
              {{ props.row.CourseSections }}
            </b-table-column>

            <b-table-column field="CourseAvg" label="Course Average" sortable>
              {{ props.row.CourseAvg }}
            </b-table-column>
            <b-table-column label="Course Page">
              <button class="button is-warning is-small">
                <router-link :to="'courses/' + props.row.CourseId">
                  <b-icon type="is-accent" icon="expand-all">
                  </b-icon>
                </router-link>
              </button>
            </b-table-column>

          </template>

          <template slot="detail" slot-scope="props">
            <b-table
              :data=getSection(props.row.CourseId)
            >
              <template slot-scope="props">
                <b-table-column field="SectionName" label="Section Name" width="180" sortable>
                  {{ props.row.SectionName }}
                </b-table-column>

                <b-table-column field="SectionTime" label="Section Time" sortable>
                  {{ props.row.SectionTime }}
                </b-table-column>

                <b-table-column field="NumStudents" label="Number of Students" numeric>
                  {{ props.row.NumStudents }}
                </b-table-column>

                <b-table-column field="SectionAvg" label="Section Average" sortable>
                  {{ props.row.SectionAvg }}
                </b-table-column>
                <b-table-column label="Section Page">
                  <button class="button is-warning is-small">+</button>
                </b-table-column>
              </template>

            </b-table>
          </template>
      </b-table>
      <button @click="fetchData">WOW :D</button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import data from './CourseListDataMock';
import { config } from '../../../../config';
import { SimpleCrud } from '../../../../middleware';


export default {
  name: 'courses',

  beforeCreate() {
    this.datamock = data.coursedata;
  },

  created() {
    this.fetchData();
    // TEST BOILERPLATE FOR THE MODAL.
  },

  data() {
    return {
      AccountCrud: new SimpleCrud(config.serverHost, '/instructor/account'),
      LoginCrud: new SimpleCrud(config.serverHost, '/instructor/login'),
      TermCrud: new SimpleCrud(config.serverHost, '/terms'),
      CourseCrud: new SimpleCrud(config.serverHost, '/courses'),
      SectionCrud: new SimpleCrud(config.serverHost, '/sections'),
      // SimpleCrud,
      // loading: false,
      // data: null,
      // error: null,
    };
  },
  methods: {
    getSection(courseid) {
      return data.coursedata.find(c => c.CourseId === courseid).Section;
    },

    async fetchData() {
      const account = await this.AccountCrud.post({
        username: 'Coleman',
        password: 'colemancs499',
        firstName: 'Professor',
        lastName: 'Coleman',
        email: 'coleman@coleman.col',
      });
      console.log(JSON.stringify(account, null, 2));

      const login = await this.LoginCrud.post({
        username: 'Coleman',
        password: 'colemancs499',
      });
      console.log(JSON.stringify(login, null, 2));

      const term = await this.TermCrud.post({ title: 'TestTerm' });
      console.log(JSON.stringify(term, null, 2));

      const course = await this.CourseCrud.post({ title: 'TestCourse', courseNo: 42 });
      console.log(JSON.stringify(course, null, 2));

      const section = await this.SectionCrud.post({
        sectionNumber: 0,
        termId: term.data.id,
        courseId: course.data.id,
      });
      console.log(JSON.stringify(section, null, 2));
    },
  },
};
</script>

