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

        </template>

        <template slot="detail" slot-scope="props">
          <b-table
            :data="datamock"
          >
            <template slot-scope="props">
              <b-table-column field="CourseId" label="Course Id" width="100" sortable>
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
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

