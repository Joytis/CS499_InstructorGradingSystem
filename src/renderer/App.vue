<template>
  <div id="app">
    <!-- <hero></hero> -->
    <navbar></navbar>
    <main class="main">
      <section class="container">
        <div class="columns">
          <div class="column">
            <menu-left>
              <router-link></router-link>
            </menu-left>
          </div>
          <div class="column is-three-quarters">
            <router-view></router-view>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'instructor_grading_system',
};
</script>

<style>
/* CSS */
</style>
