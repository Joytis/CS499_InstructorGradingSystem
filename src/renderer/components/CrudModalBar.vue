<template>
  <div>
    <!-- Assignment Category Modals -->
    <button class="button is-primary is-small" @click="isCreationModalActive = true">
      {{ createTitle }}
    </button>
    <button class="button is-warning is-small" @click="isEditModalActive = true" :disabled="!target">
      {{ editTitle }}
    </button>
    <button class="button is-danger is-small" @click="isDeletionModalActive = true" :disabled="!target">
      {{ deleteTitle }}
    </button>
    <b-modal :active.sync="isCreationModalActive" :width="640" scroll="keep" has-modal-card>
      <creation-modal-form :inputs="inputs"></creation-modal-form>
    </b-modal>
    <b-modal :active.sync="isEditModalActive" :width="640" scroll="keep" has-modal-card>
      <edit-things-modal-form :inputs="inputs" :target="target"></edit-things-modal-form>
    </b-modal>
    <b-modal :active.sync="isDeletionModalActive" :width="640" scroll="keep" has-modal-card>
      <deletion-modal-form :inputs="inputs" :target="target"></deletion-modal-form>
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
    target: Object,
    inputs: Object,
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