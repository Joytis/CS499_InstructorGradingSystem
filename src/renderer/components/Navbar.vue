<template>
  <nav class="navbar is-primary is-fixed-top ">
    <div class="navbar-brand">
      <a class="navbar-item" @click="open('https://bulma.io')">
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </a>
      <section>
        <b-dropdown>
          <button class="button is-primary" slot="trigger">
            <span> {{ CurrentSemester }} </span>
            <b-icon icon="menu-down"></b-icon>
          </button>
          <div v-for="Semester in Terms" :key="Semester">
            <b-dropdown-item v-on:click="CurrentSemester=Semester">{{ Semester }}</b-dropdown-item>
          </div>
        </b-dropdown>
      </section>
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
    data() {
      return {
        navIsActive: false,
        Terms: ['Fall 18', 'Spring 19', 'Summer 19'],
        CurrentSemester: 'Fall 18',
      };
    },
    methods: {
      toggleMenu() {
        this.navIsActive = !this.navIsActive;
      },
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>
