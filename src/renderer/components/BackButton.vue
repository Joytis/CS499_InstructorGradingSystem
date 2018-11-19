<template>
    <button class="button is-navbutton is-small" @click="goBack()">
        &nbsp; <b-icon icon="arrow-left-bold-outline"/> &nbsp;
    </button>
</template>


<script>
import router from '../router';

export default {
  name: 'BackButton',
  methods: {
    goBack() {
      router.go(-1);
    },
  },
};
</script>
