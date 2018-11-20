<template>
    
</template>

<script>
export default {
  created() {
    this.open('https://drive.google.com/open?id=1gUi4NWQxiLfx79fw6RxP3OBjl8zXL48n');
    this.$router.go(-1);
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },
};
</script>

<style>

</style>
