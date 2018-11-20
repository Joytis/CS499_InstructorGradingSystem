<template>
     <button class="button" @click="isCreationModalActive = true">
      AssCatCreate
    </button>
    <button class="button" @click="isUpdateModalActive = true">
      AssCatUpdate
    </button>
    <button class="button" @click="isAssUpdateModalActive = true">
      AssUpdate
    </button>
    <b-modal :active.sync="isCreationModalActive" has-modal-card>
      <ass-cat-create-modal-form :inputs="assCatTestInputs"></ass-cat-create-modal-form>
    </b-modal>
    <b-modal :active.sync="isUpdateModalActive" has-modal-card>
      <ass-cat-update-modal-form :inputs="assCatTestInputs" :target="selectedAssignmentCategory"></ass-cat-update-modal-form>
    </b-modal>
    <b-modal :active.sync="isAssUpdateModalActive" has-modal-card>
      <ass-update-modal-form :inputs="assUpdateTestInputs" :target="selectedAssignment"></ass-update-modal-form>
    </b-modal>
</template>

<script>
import AssCatCreateModalForm from './WhatIfModals/AssCatCreate.vue';
import AssCatUpdateModalForm from './WhatIfModals/AssCatUpdate.vue';
import AssUpdateModalForm from './WhatIfModals/AssUpdate.vue';

export default {
    components: {
        AssCatUpdateModalForm,
        AssCatCreateModalForm,
        AssUpdateModalForm,
    },
    data() {
        return {
           isCreationModalActive: false,
           isUpdateModalActive: false,
           isAssUpdateModalActive: false,
        }
    },
    assCatTestInputs: {
        templates: {
          name: { label: 'Name', type: 'input', placeholder: 'Category Name' },
          weight: {
            label: 'Weight', type: 'input', subtype: 'number', placeholder: 0.0, step: 0.01, max: 1,
          },
          lowestGradesDropped: {
            label: 'Lowest Grades Dropped', type: 'input', subtype: 'number', placeholder: 0,
          },
        },
      },
      assUpdateTestInputs: {
        templates: {
          assignmentCategoryId: {
            label: 'Assignment Category',
            type: 'dropdown',
            getData: null,
            value: 'id',
            key: 'id,',
            display: option => option.name,
          },
          name: {
            label: 'Name', type: 'input', placeholder: 'Assignment name',
          },
          totalPoints: {
            label: 'Total Points', type: 'input', subtype: 'number', placeholder: 100,
          },
          dueDate: {
            label: 'Due Date', type: 'datepicker', placeholder: Date.now(),
          },
        },
      },    
}
</script>

