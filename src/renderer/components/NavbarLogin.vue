<template>
  <nav class="navbar is-primary is-fixed-top" style="-webkit-app-region: drag">
    <div class="navbar-brand">
      <div class="navbar-item">
        <img src="../../../static/gbpp_logo.png" width="auto" height="55">
        &nbsp; GradeBook++
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
  name: 'NavbarLogin',
  data() {
    return {
      isLogoutModalActive: false,
      isEditModalActive: false,
    };
  },

  methods: {
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
