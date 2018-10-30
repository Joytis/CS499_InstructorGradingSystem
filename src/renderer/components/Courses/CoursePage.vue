<template>
  <div>
    <div class="box">
      <nav class="level">
        <div class="level-item">
          {{ $route.params.id }}
        </div>
        <div class="level-item">
          {{ getdata($route.params.id).CourseName }}
        </div>
        <div class="level-item">
          Number of sections: {{ getdata($route.params.id).CourseSections }}
        </div>
      </nav>
    </div>
    Students of Concern:
    <b-table
        :data="datamock"
        paginated
        per-page="10"
    >

        <template slot-scope="props">
          <b-table-column field="CourseId" label="Student" width="300" sortable>
            {{ props.row.CourseId }}
          </b-table-column>
          <b-table-column field="CourseName" label="Section" sortable>
            {{ props.row.CourseName }}
          </b-table-column>

          <b-table-column field="CourseSections" label="Grade" sortable>
            {{ props.row.CourseSections }}
          </b-table-column>
        </template>
    </b-table>
  </div>
</template>



<script>
import data from './CourseListDataMock';

export default {
  name: 'CoursePage',
  beforeCreate() {
    this.datamock = data.coursedata;
  },
  data() {
    return {
    };
  },
  methods: {
    getSection(courseid) {
      for (let i = 0, len = data.coursedata.length; i < len; i += 1) {
        if (data.coursedata[i].CourseId === courseid) {
          this.sectiondata = data.coursedata[i].Section;
        }
      }
      return this.sectiondata;
    },
    getdata(id) {
      for (let i = 0, len = data.coursedata.length; i < len; i += 1) {
        if (data.coursedata[i].CourseId === id) {
          this.coursedata = (data.coursedata[i]);
        }
      }
      return this.coursedata;
    },
  },
};
</script>
