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
      <creation-modal-form :inputs="inputs" :createMethod="createMethod"/>
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
      <edit-things-modal-form :inputs="inputs" :target="target" :editMethod="editMethod"/>
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
      <deletion-modal-form :inputs="inputs" :target="target" :deletionMessage="deleteMessage" :deleteMethod="deleteMethod"/>
    </b-modal>
  </div>
</template>

<script>
import CreationModalForm from './CreationModal.vue';
import EditThingsModalForm from './EditThingsModal.vue';
import DeletionModalForm from './DeletionModal.vue';

export default {
  name: 'CrudModalBar',
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
    removed: {
      type: Array,
      default: () => [],
    },
    createMethod: Function,
    editMethod: Function,
    deleteMethod: Function,
  },

  data() {
    return {
      isCreationModalActive: false,
      isEditModalActive: false,
      isDeletionModalActive: false,
    };
  },
};
</script>