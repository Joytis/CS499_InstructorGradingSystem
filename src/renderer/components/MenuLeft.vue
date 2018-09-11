<template>
  <aside class="sidebar menu">
    <p class="menu-label has-text-weight-bold">
      Development
    </p>
    <ul class="menu-list">
      <li><a @click="setActive('Login')" :class="{'is-active': isActive('Login') }">Login Page</a></li>
      <li><a @click="setActive('SCT')" :class="{'is-active': isActive('SCT') }">Server Communication Testing</a></li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      General
    </p>
    <ul class="menu-list">
      <li><a @click="setActive('Dashboard')" :class="{'is-active': isActive('Dashboard') }">Dashboard</a></li>
      <li><a @click="setActive('Courses')" :class="{'is-active': isActive('Courses') }">Courses</a></li>
      <li><a @click="setActive('Documentation')" :class="{'is-active': isActive('Documentation') }">Documentation</a></li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      Administration
    </p>
    <ul class="menu-list">
      <li><a @click="setActive('Course Settings')" :class="{'is-active': isActive('Course Settings') }">Course Settings</a></li>
      <li>
        <a @click="setActive('Manage Enrollment')" :class="{'is-active': isActive('Manage Enrollment') }">Manage Enrollment</a>
      </li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      Settings
    </p>
    <ul class="menu-list">
      <li><a @click="setActive('Account Settings')" :class="{'is-active': isActive('Account Settings') }">Account Settings</a></li>
      <li><a @click="setActive('RSS')" :class="{'is-active': isActive('RSS') }">Remote Storage Settings</a></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'MenuLeft',
  components: {},
  data () {
    return {
      activeComponent: 'Dashboard'
    }
  },
  methods: {
    isActive: function (component) {
      return component === this.activeComponent
    },
    setActive: function (component) {
      this.activeComponent = component
    }
  }
}
</script>

<style scoped>
aside {
  overflow: auto;
}
</style>


  