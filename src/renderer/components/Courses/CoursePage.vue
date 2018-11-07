<template>
  <div>
    <back-button></back-button>
      <nav class="level">
        <div class="level-item">
          <strong>{{ course.title }}</strong>
        </div>
      </nav>
    Sections:
    <b-table
        :data="course.sections"
        paginated
        per-page="10"
    >

        <template slot-scope="props">
          <b-table-column field="Id" label="Section ID" width="300" sortable>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="sectionNumber" label="Section Number" sortable>
            {{ props.row.sectionNumber }}
          </b-table-column>
        </template>
    </b-table>
  </div>
</template>



<script>
import urljoin from 'url-join';
// import CrudModalBar from '../CrudModalBar.vue';
import {
  CourseCrud,
} from '../../../../middleware';
import BackButton from '../BackButton.vue';

export default {
  name: 'CoursePage',
  components: {
    BackButton,
  },
  beforeCreate() {
    // this.datamock = data.coursedata;
  },

  created() {
    // Create cruds
    this.fetchData();
  },
  data() {
    return {
      course: [],
    };
  },
  methods: {
    async fetchData() {
      const newCourse = (await CourseCrud.get(this.$route.params.id)).data; // get course data
      const courseSectionCrud = CourseCrud.fromAppendedRoute(urljoin(String(this.$route.params.id), '/sections'));
      newCourse.sections = (await courseSectionCrud.get()).data;
      this.course = newCourse;
    },
  },
};
</script>
