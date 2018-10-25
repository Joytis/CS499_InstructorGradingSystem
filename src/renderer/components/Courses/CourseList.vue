<template>
  <div>
    <div class="box" v-for="description in datamock" :key="description">
      <nav class="level">
        <div class="level-item" :key="description.CourseId">
          {{ description.CourseId }}
        </div>
        <div class="level-item" :key="description.CourseName">
          {{ trunc(description.CourseName) }}
        </div>
        <div class="level-item" :key="description.CourseSections">
          Sections: {{ description.CourseSections }}
        </div>
        <div class="level-item" :key="description.CourseAvg">
          Average: {{ description.CourseAvg }}
        </div>
        <div class="level-item">         
          <a class="button is-success">+</a>
        </div>
    </nav>
    </div>
  </div>
</template>


<script>
import coursedata from './CourseListDataMock';

export default {
  name: 'Courses',
  beforeCreate() {
    this.datamock = coursedata.coursedata;
  },
  data() {
    return {
    };
  },
  methods: {
    trunc(arg) {
      let str = arg;
      const len = 15;
      if (str.length > (len + 3)) {
        str = `${str.substring(0, len)}...`;
      }
      return str;
    },

  },
};
</script>
