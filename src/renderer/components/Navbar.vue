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
          <b-dropdown>
            <button class="button is-primary" slot="trigger">
              <span> {{ CurrentSemester }} </span>
              <b-icon icon="chevron-down"></b-icon>
            </button>
            <div v-for="Semester in Terms" :key="Semester">
              <b-dropdown-item v-on:click="CurrentSemester=Semester">{{ Semester }}</b-dropdown-item>
            </div>
          </b-dropdown>
      </div>
    </div>
    <div class="navbar-menu is-active">
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
  export default {
    name: 'Navbar',
    data() {
      return {
        navIsActive: true,
        Terms: ['Fall 18', 'Spring 19', 'Summer 19'],
        CurrentSemester: 'Fall 18',
      };
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
      close() {
        this.$electron.remote.BrowserWindow.getFocusedWindow().close();
      },
    },
  };
</script>

<style>
html {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
