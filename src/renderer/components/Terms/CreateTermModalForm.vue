<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Create New Term</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Term Name">
          <b-input
            :value="termName"
            placeholder="Spring '18"
            required>
          </b-input>
        </b-field>
        <b-field label="Term Start Date">
          <b-datepicker
            placeholder="Select a date (mm/dd/yyyy)"
            icon="calendar-today"
            editable
            inline
            required>
          </b-datepicker>
        </b-field>
        <b-field label="Term End Date">
          <b-datepicker
            placeholder="Select a date (mm/dd/yyyy)"
            icon="calendar-today"
            editable
            inline
            required>
          </b-datepicker>
        </b-field>
      </section>
      <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="button is-primary" @click="$parent.close()">Create</button>
      </footer>
    </div>
  </form>
</template>



<script>
export default {
  name: 'CreateTermModalForm',
  components: {
  },
  props: [],
  data() {
    return {
      termName: '',
      startDate: '',
      endDate: '',
    };
  },
};
</script>

<style>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
