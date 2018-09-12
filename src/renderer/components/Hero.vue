<template>
  <div id="wrapper">
    <div class="hero">
      <section class="hero is-primary">

      <!-- Hero content: will be in the middle -->
        <div class="hero-body">
          <div class="container has-text-centered">
            <b-tooltip label="I do nothing!" type="is-dark" >
              <h1 class="title">
                Instructor Grading System
              </h1>
            </b-tooltip>
            <h2 class="subtitle">
              Very Basic Mock
            </h2>
          </div>
        </div>
        <!-- Hero footer: will stick at the bottom -->
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Hero',
    components: {
    },
    data() {
      return {
      };
    },
    methods: {
    },
  };
</script>

<style scoped>

.hero {
  position: fixed;
  width: 100%;
}

</style>
