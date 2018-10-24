<template>
  <div id="wrapper">
    <navbar @toggleMenu="menuActive=!menuActive;"></navbar>
    <multipane class="vertical-panes" layout="vertical">
      <div class="pane" v-if="menuActive" :style="{ width: '14em', maxWidth: '17em', minWidth: '10em'}">
        <menu-left></menu-left>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1 }">
        <router-view></router-view>
      </div>
    </multipane>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane';
import Navbar from './components/Navbar.vue';
import MenuLeft from './components/NavMenu/MenuLeft.vue';

export default {
  name: 'other-page',
  components: {
    MenuLeft,
    Navbar,
    Multipane,
    MultipaneResizer,
  },
  data() {
    return {
      menuActive: true,
    };
  },
  methods: {},
};
</script>

<style>
menu-left {
  overflow: auto;
}

.multipane {
  padding-top: 52px;
  z-index: -2;
}

.vertical-panes {
  width: 100%;
  height: calc(100vh);
  border: 1px solid #ccc;
}
.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: auto;
  background: #fff;
}
.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}

#wrapper {
  overflow: auto;
}

html {
  overflow-y: auto;
}

/* ::-webkit-scrollbar { display: none; } */
</style>

