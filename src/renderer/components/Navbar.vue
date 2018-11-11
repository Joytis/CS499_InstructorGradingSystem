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
            <button class="button is-primary" slot="trigger" click>
              <span> {{ CurrentTerm.title }} </span>
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
        <!-- This allows users to change their account stuff up! -->
        <a class="navbar-item is-right">
          <b-dropdown style="justify-content: flex-end">
            <button class="button is-primary" slot="trigger" click>
              <b-icon icon="account" type="is-medium"></b-icon>
            </button>
            <b-dropdown-item @click="isLogoutModalActive = true">Logout</b-dropdown-item>
            <b-dropdown-item @click="isEditModalActive = true">Edit Account</b-dropdown-item>
          </b-dropdown>
          <!-- Simple little logout modal -->
          <b-modal :active.sync="isLogoutModalActive" :width="640" scroll="keep" has-modal-card >
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">Logout</p>
              </header>
              <section class="modal-card-body">
                Are you sure you want to log out?
              </section>
              <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <button class="button is-primary" @click="logout">Logout</button>
              </footer>
            </div>
          </b-modal>
          <!-- Modal for editing instructor information -->
          <b-modal :active.sync="isEditModalActive" :width="640" scroll="keep" has-modal-card>
            <edit-things-modal-form :inputs="instructorModalInputs" :target="instructor"/>
          </b-modal>
        </a>
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
import {
  TermCrud, EventBus, LogoutCrud, AccountCrud,
} from '../../../middleware';
import EditThingsModalForm from './EditThingsModal.vue';
import InstructorModalInputs from './InstructorModalInputs';

export default {
  name: 'Navbar',
  components: {
    AtomSpinner,
    EditThingsModalForm,
  },
  data() {
    return {
      navIsActive: true,
      isLogoutModalActive: false,
      isEditModalActive: false,
      instructor: {},
      Terms: [],
      CurrentTerm: {},
      dropdown: {
        error: '',
        state: 'main',
      },
      instructorModalInputs: InstructorModalInputs.instructorModalInputs,
    };
  },

  created() {
    this.fetchTerms();
    this.fetchInstructor();
    EventBus.$on('term-added', this.termAdded);
    EventBus.$on('request-selected-term', this.requestSelectedTerm);
  },

  beforeDestroy() {
    EventBus.$off('term-added', this.termAdded);
    EventBus.$off('request-selected-term', this.requestSelectedTerm);
  },

  methods: {
    termAdded(newTerm) { this.Terms.push(newTerm); },
    requestSelectedTerm() { EventBus.$emit('response-selected-term', this.CurrentTerm); },

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
        this.Terms = (await TermCrud.get()).data;
        this.dropdown.state = 'main';
      } catch (err) {
        this.dropdown.state = 'error';
        this.error = err;
      }
    },
    async fetchInstructor() { this.instructor = (await AccountCrud.get()).data; },
    async logout() {
      const result = (await LogoutCrud.post());
      EventBus.$emit('logout', result);
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
