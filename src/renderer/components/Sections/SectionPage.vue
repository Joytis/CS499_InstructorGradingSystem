<template>
  <div>
    <div class="box">
      <nav class="level">
        <div class="level-item">
          {{ $route.params.id }}
        </div>
        <div class="level-item">
          {{ $route.params.section }}
        </div>
      </nav>
    </div>
    <br>
    Students:

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
import data from '../Courses/CourseListDataMock';

export default {
  name: 'SectionPage',

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
