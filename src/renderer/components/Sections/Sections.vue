<template>
  <section>
    <crud-modal-bar
      createTitle="Create Section"
      editTitle="Edit Section"
      deleteTitle="Delete Section"
      :target="selected"
      :inputs="modalInputs"
    />
    
    <b-table
      :data="sections"
      paginated
      per-page="10"
      :selected.sync="selected"
    >
      <template slot-scope="props">
        <b-table-column field="course.courseLabel" label="Course Label" sortable>
          {{ props.row.course.courseLabel }}
        </b-table-column>
        <b-table-column field="course.courseTitle" label="Course Title" sortable>
          {{ props.row.course.title }}
        </b-table-column>
        <b-table-column field="sectionNumber" label="Section Number" sortable>
          {{ props.row.sectionNumber }}
        </b-table-column>
        <b-table-column label="Section Page">
          <button class="button is-warning is-small">
            <router-link :to="'sections/' + props.row.courseId + '/' + props.row.id">
              <b-icon type="is-accent" icon="expand-all">
              </b-icon>
            </router-link>
          </button>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>


<script>
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import CrudModalBar from '../CrudModalBar.vue';
import {
  CourseCrud, SectionCrud, EventBus, Finders,
} from '../../../../middleware';

export default {
  name: 'Sections',

  created() {
    this.fetchData();

    EventBus.$on('section-added', this.sectionAdded);
    EventBus.$on('section-updated', this.sectionUpdated);
    EventBus.$on('section-removed', this.sectionRemoved);
    EventBus.$on('term-swapped', this.fetchData);
  },
  beforeDestroy() {
    EventBus.$off('section-added', this.sectionAdded);
    EventBus.$off('section-updated', this.sectionUpdated);
    EventBus.$off('section-removed', this.sectionRemoved);
    EventBus.$off('term-swapped', this.fetchData);
  },

  components: {
    CrudModalBar,
  },

  data() {
    const data = {
      isCreationModalActive: false,
      isEditThingsModalActive: false,
      selected: null,
      sections: [],
      courses: [],
      // Arguments passed into the creation modal for sections.
      modalInputs: {
        crudTarget: SectionCrud,
        preCreate: null,
        postCreate(result) { EventBus.$emit('section-added', result); },
        postUpdate(result) { EventBus.$emit('section-updated', result); },
        postDelete(result) { EventBus.$emit('section-removed', result); },
        templates: {
          courseId: {
            label: 'Course',
            type: 'dropdown',
            getData: null,
            value: 'id',
            key: 'id',
            display: option => `${option.courseLabel} - ${option.title}`,
            // display: () => 'TEST',
          },
          sectionNumber: {
            label: 'Section Number', type: 'input', subtype: 'number', placeholder: '00',
          },
          gradeScaleA: {
            label: 'Grade Scale: A (Out of 100)', type: 'input', subtype: 'number', placeholder: '90',
          },
          gradeScaleB: {
            label: 'Grade Scale: B (Out of 100)', type: 'input', subtype: 'number', placeholder: '80',
          },
          gradeScaleC: {
            label: 'Grade Scale: C (Out of 100)', type: 'input', subtype: 'number', placeholder: '70',
          },
          gradeScaleD: {
            label: 'Grade Scale: D (Out of 100)', type: 'input', subtype: 'number', placeholder: '60',
          },
        },
      },
      init() {
        this.modalInputs.templates.courseId.getData = () => this.courses.sort((a, b) => {
          const nameA = a.courseLabel.toUpperCase();
          const nameB = b.courseLabel.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        this.modalInputs.preCreate = async (staged) => {
          // Retrieve the desired course and term ID
          // Querying events here because we don't have access to other members in data asection.
          const termId = (await Finders.SelectedTerm()).id;
          const instructorId = (await Finders.CurrentInstructor()).id;
          return Object.assign({ termId, instructorId }, staged);
        };
      },
    };
    data.init();
    return data;
  },
  methods: {
    sectionAdded(section) {
      section.course = this.courses.find(c => c.id === section.courseId);
      this.sections.push(section);
    },
    sectionRemoved(section) {
      this.sections = this.sections.filter(c => c.id !== section.id);
    },
    sectionUpdated(section) {
      section.course = this.courses.find(c => c.id === section.courseId);
      this.sections[this.sections.findIndex(c => c.id === section.id)] = section;
    },
    async fetchData() {
      this.courses = (await CourseCrud.get()).data;
      const rawSections = (await SectionCrud.get()).data;
      const instructor = await Finders.CurrentInstructor();
      const term = await Finders.SelectedTerm();
      let filteredSections = rawSections.filter(s => s.instructorId === instructor.id);
      filteredSections = filteredSections.filter(s => s.termId === term.id);
      filteredSections.forEach(section => {
        section.course = this.courses.find(c => c.id === section.courseId);
      });
      this.sections = filteredSections;
    },
  },
};
</script>