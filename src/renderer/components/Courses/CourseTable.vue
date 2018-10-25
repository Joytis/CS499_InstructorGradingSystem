<template>
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
            <button class="button is-primary is-small">
              <router-link :to="'courses/' + props.row.CourseId" tag="li" >
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
                <button class="button is-primary is-small">+</button>
              </b-table-column>
            </template>

          </b-table>
        </template>

    </b-table>
</template>

<script>
import data from './CourseListDataMock';


export default {
  name: 'courses',
  beforeCreate() {
    this.datamock = data.coursedata;
    // this.sectionmock = data.coursedata[0].Section;
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
  },
};
</script>

