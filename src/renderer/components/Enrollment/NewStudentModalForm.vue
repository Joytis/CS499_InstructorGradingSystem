<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Create Student</p>
    </header>
    <section class="modal-card-body">
      <div v-if="state === 'loading'">
        <atom-spinner
          :animation-duration="1000"
          :size="200"
          :color="'#cd5bef'"
         />
      </div>
      <div v-else-if="state === 'error'">
        <div> {{ error.message }} </div>
      </div>
      <div v-else-if="state === 'success'">
        Success!
      </div>
      <div v-else>
        <b-field label="A-Number">
          <b-input
            type="number"
            v-model="student.aNumber"
            placeholder="A########"
            required>
          </b-input>
        </b-field>
        <b-field label="First Name">
          <b-input
            v-model="student.firstName"
            placeholder="First Name"
            required>
          </b-input>
        </b-field>
				<b-field label="Last Name">
          <b-input
            v-model="student.lastName"
            placeholder="Last Name"
            required>
          </b-input>
        </b-field>
				<b-field label="Email">
          <b-input
						type="email"
            v-model="student.email"
            placeholder="UAH Email"
            required>
          </b-input>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" :disabled="validateStudent" @click="attemptStudentCreate">Create</button>
    </footer>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { AtomSpinner } from 'epic-spinners';
import { StudentCrud, EventBus } from '../../../../middleware';

export default {
  name: 'CreateCourseModal',
  components: {
    AtomSpinner,
  },
  props: [],
  data() {
    return {
      error: undefined,
      state: 'main',
      student: {
        aNumber: '',
        firstName: '',
        lastName: '',
        email: '',
      },
      validationMsg: {
        aNumber: '',
      },
    };
  },
  methods: {
    async attemptStudentCreate() {
      try {
        this.state = 'loading';
        const student = (await StudentCrud.post(this.student)).data;
        this.state = 'success';
        EventBus.$emit('student-added', student);
      } catch (err) {
        console.error(err);
        this.state = 'error';
        this.error = err;
      }
    },

    validateANumber() {
      const value = this.student.aNumber;
      if (value.length !== 9) {
        this.validationMsg.aNumber = 'ANumber must be an A######## string';
        return false;
      }
      if (value[0] !== 'A') {
        this.validationMsg.aNumber = 'ANumber must start with A';
        return false;
      }
      if (Number.isInteger(Number(value.substr(1)))) {
        this.validationMsg.aNumber = 'ANumber must be a number';
        return false;
      }
      return true;
    },
  },
};
</script>
