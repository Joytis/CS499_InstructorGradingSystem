<template>
  <nav class="navbar is-primary is-fixed-top ">
    <div class="navbar-brand">
      <a class="navbar-item" @click="open('https://bulma.io')">
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </a>
      <div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}" data-target="mainNav">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="mainNav" class="navbar-menu" :class="{'is-active': navIsActive} + ' is-primary'">
      <div class="navbar-start">
        <a class="navbar-item">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Docs
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    data () {
      return {
        navIsActive: false
      }
    },
    methods: {
      toggleMenu: function () {
        this.navIsActive = !this.navIsActive
      },
      open: function (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
