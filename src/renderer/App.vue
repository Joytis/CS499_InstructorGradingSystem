<template>
  <div v-if="loggedIn" id="wrapper">
    <navbar @toggleMenu="menuActive=!menuActive;"></navbar>
    <multipane class="vertical-panes" layout="vertical">
      <div id="mainmenu" class="pane" v-if="menuActive" :style="{ width: '14em', maxWidth: '17em', minWidth: '10em'}">
        <menu-left></menu-left>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1 }">
        <router-view></router-view>
      </div>
    </multipane>
  </div>
  <div v-else>
    <auth-modal/>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane';
import { EventBus, AccountCrud } from '../../middleware';
import AuthModal from './components/AuthModal/AuthModal.vue';
import Navbar from './components/Navbar.vue';
import MenuLeft from './components/NavMenu/MenuLeft.vue';
import 'buefy/lib/buefy.css';
import 'vue-material-design-icons/styles.css';
import '@mdi/font/css/materialdesignicons.min.css';


export default {
  name: 'other-page',
  components: {
    MenuLeft,
    Navbar,
    Multipane,
    MultipaneResizer,
    AuthModal,
  },
  created() {
    EventBus.$on('login', this.login);
    EventBus.$on('logout', this.logout);
    EventBus.$on('request-instructor', this.requestInstructor);
  },
  beforeDestroy() {
    EventBus.$off('login', this.login);
    EventBus.$off('logout', this.logout);
    EventBus.$off('request-instructor', this.requestInstructor);
  },

  data() {
    return {
      menuActive: true,
      loggedIn: false,
      instructor: null,
    };
  },
  methods: {
    requestInstructor() { EventBus.$emit('response-instructor', this.instructor); },
    // Let's have this run constantly
    async login() {
      this.loggedIn = true;
      this.instructor = (await AccountCrud.get()).data;
      this.$router.replace('/sections'); // Replaces browser history from previous user
    },
    logout() {
      this.loggedIn = false;
      this.instructor = null;
    },
  },
};
</script>

<style>
menu-left {
  overflow: auto;
}

.multipane {
  padding-top: 51px;
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

#mainmenu {
  background: #eeeeee;
}

#wrapper {
  overflow: auto;
}

/* ::-webkit-scrollbar { display: none; } */
</style>
<style lang="scss">
@import "App";
</style>

<style>
html {
  overflow-y: auto;
}

html,
body,
#app,
#app > div,
.animation-content,
.animation-content > div,
.modal-card,
.modal-card-body {
  overflow: auto;
}

.modal-card {
  width: auto !important;
  padding-top: 51px;
}
</style>


