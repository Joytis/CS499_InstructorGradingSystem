<template>
  <div id="wrapper">
    <navbar></navbar>
    <main class="main">
      <section class="container">
        <div class="columns is-gapless" style="height: 100%; margin-top: 0; margin-bottom: 0;">
          <div class="column" style="overflow: auto;">
            <menu-left></menu-left>
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
import Hero from './components/Hero.vue';
import Navbar from './components/Navbar.vue';
import MenuLeft from './components/NavMenu/MenuLeft.vue';

export default {
  name: 'other-page',
  components: {
    Hero,
    MenuLeft,
    Navbar,
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

