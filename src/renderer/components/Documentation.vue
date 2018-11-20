<template>
    
</template>

<script>
export default {
  created() {
    this.open('https://docs.google.com/document/d/14X9OTdXHzfwUsLmJ3RkjU1R2UEAKClEda97BxTieBDg/edit?usp=sharing');
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
