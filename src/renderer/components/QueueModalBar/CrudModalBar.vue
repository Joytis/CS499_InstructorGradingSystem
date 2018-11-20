<template>
  <div>
    <!-- Creation -->
    <button 
      v-if="!removed.includes('create')"
      class="button is-primary is-small" 
      @click="isCreationModalActive = true"
    >
      {{ createTitle }}
    </button>
    <b-modal 
      v-if="!removed.includes('create')"
      :active.sync="isCreationModalActive" 
      :width="640" 
      scroll="keep" 
      has-modal-card
    >
      <creation-modal-form @returnEvent="emitCreate($event)" :inputs="inputs"/>
    </b-modal>

    <!-- Editing -->
    <button 
      v-if="!removed.includes('edit')"
      class="button is-warning is-small" 
      @click="isEditModalActive = true" 
      :disabled="!target"
    >
      {{ editTitle }}
    </button>
    <b-modal 
      v-if="!removed.includes('edit')"
      :active.sync="isEditModalActive" 
      :width="640" 
      scroll="keep" 
      has-modal-card
    >
      <edit-things-modal-form @returnEvent="emitEdit($event)" :inputs="inputs" :target="target"/>
    </b-modal>

    <!-- Deletion -->
    <button 
      v-if="!removed.includes('delete')"
      class="button is-danger is-small" 
      @click="isDeletionModalActive = true" 
      :disabled="!target"
    >
      {{ deleteTitle }}
    </button>
    <b-modal 
      v-if="!removed.includes('delete')"
      :active.sync="isDeletionModalActive" 
      :width="640" 
      scroll="keep" 
      has-modal-card
    >
      <deletion-modal-form @returnEvent="emitDelete($event)" :inputs="inputs" :target="target" :deletionMessage="deleteMessage"/>
    </b-modal>
  </div>
</template>

<script>
import CreationModalForm from './CreationModal.vue';
import EditThingsModalForm from './EditThingsModal.vue';
import DeletionModalForm from './DeletionModal.vue';

export default {
  name: 'CrudQueueModalBar',
  components: {
    CreationModalForm,
    EditThingsModalForm,
    DeletionModalForm,
  },

  props: {
    createTitle: String,
    editTitle: String,
    deleteTitle: String,
    deleteMessage: String,
    target: Object,
    inputs: Object,
    emitType: String,
    removed: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditModalActive: false,
      isDeletionModalActive: false,
    };
  },
  methods: {
    emitEdit(event) {
      const eventtype = `${this.emitType}edit`;
      this.$emit(eventtype, event);
    },
    emitCreate(event) {
      const eventtype = `${this.emitType}create`;
      this.$emit(eventtype, event);
    },
    emitDelete(event) {
      const eventtype = `${this.emitType}delete`;
      this.$emit(eventtype, event);
    },

  },
};
</script>