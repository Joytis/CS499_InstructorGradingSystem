<template>
  <div id="wrapper">
    <!-- <hero></hero> -->
    <navbar></navbar>
    <main class="main">
      <section class="container">
        <div class="columns">
          <div class="column">
            <menu-left></menu-left>
          </div>
          <div class="column is-three-quarters">
            <course-table></course-table>
          </div>
        </div>
      </section>
    </main>
</div>
</template>

<script>
import Hero from './Hero.vue';
import Navbar from './Navbar.vue';
import MenuLeft from './NavMenu/MenuLeft.vue';
import ContentBodyMock from './ContentBodyMock.vue';
import CourseTable from './Courses/CourseTable.vue';

export default {
  name: 'other-page',
  components: {
    Hero,
    MenuLeft,
    ContentBodyMock,
    Navbar,
    CourseTable,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
menu-left {
  overflow: auto;
}

main {
  padding-top: 55px;
}
</style>
