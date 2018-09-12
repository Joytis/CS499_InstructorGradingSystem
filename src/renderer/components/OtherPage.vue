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
            <content-body-mock></content-body-mock>
          </div>
        </div>
      </section>
    </main>
</div>
</template>

<script>
import Hero from './Hero'
import Navbar from './Navbar'
import MenuLeft from './NavMenu/MenuLeft'
import ContentBodyMock from './ContentBodyMock'

export default {
  name: 'other-page',
  components: {
    Hero,
    MenuLeft,
    ContentBodyMock,
    Navbar
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

menu-left {
  overflow: auto;
}

main {
  padding-top: 55px;
}
</style>
