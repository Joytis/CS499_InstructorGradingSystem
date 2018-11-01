<template>
  <nav class="navbar is-primary is-fixed-top" style="-webkit-app-region: drag">
    <div class="navbar-brand">
      <a class="navbar-item is-hoverable" @click="toggleMenu">
        <b-icon icon="menu"></b-icon>
      </a>
      <div class="navbar-item">
        <img src="../../../static/gbpp_logo.png" width="auto" height="55">
        &nbsp; GradeBook++
      </div>
      <div class="navbar-item">
        <div v-if="dropdown.state === 'loading'">
          <atom-spinner :animation-duration="1000" :size="40" :color="'#cd5bef'"/>
        </div>
        <div v-else-if="dropdown.state === 'error'">
          <div> {{ error.message }} </div>
        </div>
        <div v-else>
          <b-dropdown>
            <button class="button is-primary" slot="trigger" click="fetchTerms">
              <span> {{ CurrentTerm }} </span>
              <b-icon icon="chevron-down"></b-icon>
            </button>
            <div v-for="Term in Terms">
              <b-dropdown-item v-on:click="CurrentTerm=Term">{{ Term.title }}</b-dropdown-item>
            </div>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div v-if="navIsActive" class="navbar-menu is-active">
      <div class="navbar-end">
        <a id="min-btn" class="navbar-item is-right" @click="minimize">
          <b-icon icon="window-minimize" style="justify-content: flex-end"></b-icon>
        </a>
        <a id="max-btn" class="navbar-item is-right" @click="maximize">
          <b-icon icon="window-maximize" style="justify-content: flex-end"></b-icon>
        </a>
        <a id="close-btn" class="navbar-item is-right" @click="close">
          <b-icon icon="window-close" style="justify-content: flex-end"></b-icon>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { AtomSpinner } from 'epic-spinners';
import { TermCrud, Timeout } from '../../../middleware';

export default {
  name: 'Navbar',
  components: {
    AtomSpinner,
  },
  data() {
    return {
      navIsActive: true,
      Terms: [],
      CurrentTerm: null,
      dropdown: {
        error: '',
        state: 'main',
      },
    };
  },

  created() {
    this.fetchTerms();
    this.asyncQueryTermsFuckIt();
  },

  methods: {
    toggleMenu() {
      this.navIsActive = !this.navIsActive;
      this.$emit('toggleMenu');
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    minimize() {
      this.$electron.remote.BrowserWindow.getFocusedWindow().minimize();
    },
    maximize() {
      const window = this.$electron.remote.BrowserWindow.getFocusedWindow();
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    },
    async fetchTerms() {
      try {
        this.dropdown.state = 'loading';
        this.Terms = await TermCrud.get();
        this.dropdown.state = 'main';
      } catch (err) {
        this.dropdown.state = 'error';
        this.error = err;
      }
    },
    async fetchTerms() {
      while (true) {
        if (dropdown.state === 'error') {
          await fetchTerms();
        }
        await Timeout(1000);
      }
    },
    close() {
      this.$electron.remote.BrowserWindow.getFocusedWindow().close();
    },
  },
};
</script>

<style>
.navbar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.navbar-item {
  -webkit-app-region: no-drag;
  -webkit-user-select:auto;
  -moz-user-select: auto;
  -ms-user-select: auto;
  user-select: auto;
}

</style>
