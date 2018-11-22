<template>
  <section>
    <crud-modal-bar
      createTitle="Create Course"
      editTitle="Edit Courses"
      deleteTitle="Delete Course"
      :target="selected"
      :inputs="modalInputs"
    />
    
    <b-table
      :data="courses"
      paginated
      per-page="10"
      :selected.sync="selected"
    >
      <template slot-scope="props">
        <b-table-column field="courseLabel" label="Course Label" sortable>
          {{ props.row.courseLabel }}
        </b-table-column>
        <b-table-column field="title" label="Title" numeric>
          {{ props.row.title }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>


<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import CrudModalBar from '../CrudModalBar.vue';
import { CourseCrud, EventBus } from '../../../../middleware';

export default {
  name: 'Courses',

  created() {
    this.fetchData();

    EventBus.$on('course-added', this.courseAdded);
    EventBus.$on('course-removed', this.courseRemoved);
    EventBus.$on('course-updated', this.courseUpdated);
  },
  beforeDestroy() {
    EventBus.$off('course-added', this.courseAdded);
    EventBus.$off('course-removed', this.courseRemoved);
    EventBus.$off('course-updated', this.courseUpdated);
  },

  components: {
    CrudModalBar,
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      selected: null,
      courses: [],
      // Arguments passed into the creation modal for courses.
      modalInputs: {
        crudTarget: CourseCrud,
        postCreate(result) { EventBus.$emit('course-added', result); },
        postUpdate(result) { EventBus.$emit('course-updated', result); },
        postDelete(result) { EventBus.$emit('course-removed', result); },
        templates: {
          courseLabel: { label: 'Course Label', type: 'input', placeholder: 'CS100' },
          title: { label: 'Course Title', type: 'input', placeholder: 'Intro to Code' },
        },
      },
    };
  },
  methods: {
    courseAdded(course) {
      this.courses.push(course);
    },
    courseRemoved(course) {
      this.courses = this.courses.filter(c => c.id !== course.id);
    },
    courseUpdated(course) {
      this.courses[this.courses.findIndex(c => c.id === course.id)] = course;
    },
    async fetchData() { this.courses = (await CourseCrud.get()).data; },
  },
};
</script>