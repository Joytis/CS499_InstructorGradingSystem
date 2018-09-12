<template>
  <aside class="sidebar menu">
    <template v-for="block in struct.menu">
      <p :key="block.title + '-title'" class="menu-label has-text-weight-bold">
        {{block.title}}
      </p>
      <ul :key="block.title + '-items'" class="menu-list">
        <li v-for="menuItem in block.menuItems" :key="menuItem"><a @click="setActive(menuItem)" :class="{'is-active': isActive(menuItem) }">{{ menuItem }}</a></li>
      </ul>
    </template>
  </aside>
</template>

<script>
import MenuStruct from './MenuStruct'

export default {
  name: 'MenuLeft',
  components: {},
  beforeCreate: function () {
    this.struct = MenuStruct
  },
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


  