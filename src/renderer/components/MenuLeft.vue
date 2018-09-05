<template>
  <aside class="sidebar menu">
    <p class="menu-label has-text-weight-bold">
      Development
    </p>
    <ul class="menu-list">
      <li><a>Login Page</a></li>
      <li><a>Server Communication Testing</a></li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      General
    </p>
    <ul class="menu-list">
      <li><a class="is-active">Dashboard</a></li>
      <li><a>Courses</a></li>
      <li><a>Documentation</a></li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      Administration
    </p>
    <ul class="menu-list">
      <li><a>Course Settings</a></li>
      <li>
        <a>Manage Enrollment</a>
      </li>
    </ul>
    <p class="menu-label has-text-weight-bold">
      Settings
    </p>
    <ul class="menu-list">
      <li><a>Account Settings</a></li>
      <li><a>Remote Storage Settings</a></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'MenuLeft',
  components: {},
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
aside {
  overflow: auto;
}
</style>


  