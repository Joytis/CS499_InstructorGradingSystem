<template>
  <div id="wrapper">
    <hero></hero>
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
import MenuLeft from './MenuLeft'
import ContentBodyMock from './ContentBodyMock'

export default {
  name: 'other-page',
  components: {
    Hero,
    MenuLeft,
    ContentBodyMock
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.main {
  position: relative;
  padding-top: 200px;
  z-index: -1;
}

menu-left {
  overflow: auto;
}
</style>
