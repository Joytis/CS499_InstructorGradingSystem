<template>
  <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
          <p class="modal-card-title">Create Course</p>
      </header>
      <section class="modal-card-body">
          <b-field label="id">
              <b-input
                  :value="id"
                  placeholder="CS000"
                  required>
              </b-input>
          </b-field>
          <b-field label="title">
              <b-input
                  :value="title"
                  placeholder="Intro to code"
                  required>
              </b-input>
          </b-field>

      </section>
      <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="button is-primary" @click="$parent.close()">Create</button>
      </footer>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      id: '',
      title: '',
    };
  },
};
</script>
