<template>
  <div id="wrapper">
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
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane';
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
  },
  data() {
    return {
      menuActive: true,
    };
  },
  methods: {},
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
@import "~bulma/sass/utilities/_all";
// Set your colors
$primary: #7957d5;
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);
$accent: #666666;
$accent-invert: findColorInvert($accent);
$navbutton: #cccccc;
$navbutton-invert: findColorInvert($navbutton);
// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  ),
  "twitter": (
    $twitter,
    $twitter-invert
  ),
  "accent": (
    $accent,
    $accent-invert
  ),
  "navbutton": (
    $navbutton,
    $navbutton-invert
  )
);
// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;
$gap: 64px;
// 960, 1152, and 1344 have been chosen because they are divisible by both 12 and 16
$tablet: 200px;
// 960px container + 4rem
$desktop: 300px + (2 * $gap);
// 1152px container + 4rem
$widescreen: 1152px + (2 * $gap);
$widescreen-enabled: true;
// 1344px container + 4rem
$fullhd: 1344px + (2 * $gap);
$fullhd-enabled: true;
$navbar-breakpoint: 300px;
// Import Bulma and Buefy styles;
@import "~bulma";
@import "~buefy/src/scss/buefy";
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


