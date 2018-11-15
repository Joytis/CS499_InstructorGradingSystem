<template>
  <button class="button is-primary" @click="fileSelect">
    File Menu
  </button>
</template>
  
<script>

export default {
  name: 'ContentBodyMock',
  components: {},
  data() {
    return {
      isSignInModalActive: false,
      isSignUpModalActive: false,
    };
  },
  methods: {
    fileSelect() {
      this.$electron.remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] },
        (files) => {
          if (files !== undefined) {
            // handle files
          }
        });
    },
  },
};
</script>

]