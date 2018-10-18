<template>
  <aside class="sidebar menu">
    <template v-for="block in struct.menu">
      <p :key="block.title + '-title'" class="menu-label has-text-weight-bold">
        {{block.title}}
      </p>
      <ul :key="block.title + '-items'" class="menu-list">
        <router-link tag="li" v-for="menuItem in block.menuItems" :key="menuItem.itemTitle" :to="menuItem.itemLink"><a :class="{'is-active': isActive(menuItem.itemTitle) }">{{ menuItem.itemTitle }}</a></router-link>
        <!--  -->
      </ul>
    </template>
  </aside>
</template>

<script>
import MenuStruct from './MenuStruct';

export default {
  name: 'MenuLeft',
  components: {},
  beforeCreate() {
    this.struct = MenuStruct;
  },
  data() {
    return {};
  },
  methods: {
    isActive(component) {
      return component === this.routeName;
    },
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
};
</script>

<style scoped>
aside {
  overflow: auto;
}
</style>


  