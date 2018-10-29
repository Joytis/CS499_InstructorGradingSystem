<template>
  <div>
    <div class="box">
      <nav class="level">
        <div class="level-item">
          {{ $route.params.id }}
        </div>
        <div class="level-item">
          {{ getdata($route.params.id).CourseName }}
        </div>
        <div class="level-item">
          Number of sections: {{ getdata($route.params.id).CourseSections }}
        </div>
      </nav>
    </div>
    Course At a Glance:
    <div class="box">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <div class="columns">
              <p class="heading">Mean</p>
              <p class="title">70</p>
            </div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <div class="columns">
              <p class="heading">Median</p>
              <p class="title">70</p>
            </div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <div class="columns">
              <p class="heading">Mode</p>
              <p class="title">70</p>
            </div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <div class="columns">
              <p class="heading">Std. Dev</p>
              <p class="title">70</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <br>
    Students of Concern:
    <b-table
        :data="datamock"
        paginated
        per-page="10"
    >

        <template slot-scope="props">
          <b-table-column field="CourseId" label="Student" width="300" sortable>
            {{ props.row.CourseId }}
          </b-table-column>
          <b-table-column field="CourseName" label="Section" sortable>
            {{ props.row.CourseName }}
          </b-table-column>

          <b-table-column field="CourseSections" label="Grade" sortable>
            {{ props.row.CourseSections }}
          </b-table-column>
        </template>
    </b-table>
  </div>
</template>



<script>
import data from './CourseListDataMock';

// Hello Course Page
// {{ $route.path }}
// {{ $route.params }}
export default {
  name: 'CoursePage',
  beforeCreate() {
    this.datamock = data.coursedata;
  },
  data() {
    return {
    };
  },
  methods: {
    getSection(courseid) {
      for (let i = 0, len = data.coursedata.length; i < len; i += 1) {
        if (data.coursedata[i].CourseId === courseid) {
          this.sectiondata = data.coursedata[i].Section;
        }
      }
      return this.sectiondata;
    },
    getdata(id) {
      for (let i = 0, len = data.coursedata.length; i < len; i += 1) {
        if (data.coursedata[i].CourseId === id) {
          this.coursedata = (data.coursedata[i]);
        }
      }
      return this.coursedata;
    },
  },
};

// <b-table
//     :data=getdata($route.params.id)
//     detailed
//   >
//     <template slot-scope="props">
//         <b-table-column field="CourseId" label="Course ID" width="130" sortable>
//           {{ props.row.CourseId }}
//         </b-table-column>
//         <b-table-column field="CourseName" label="Course Name" sortable>
//           {{ props.row.CourseName }}
//         </b-table-column>
//         <b-table-column field="CourseSections" label="Number of Sections" numeric>
//           {{ props.row.CourseSections }}
//         </b-table-column>
//         <b-table-column field="CourseAvg" label="Course Average" sortable>
//           {{ props.row.CourseAvg }}
//         </b-table-column>
//     </template>

//     <template slot="detail" slot-scope="props">
//       <b-table
//         :data=getSection(props.row.CourseId)
//       >
//         <template slot-scope="props">
//                 <b-table-column field="SectionName" label="Section Name" width="180" sortable>
//                   {{ props.row.SectionName }}
//                 </b-table-column>

//                 <b-table-column field="SectionTime" label="Section Time" sortable>
//                   {{ props.row.SectionTime }}
//                 </b-table-column>

//                 <b-table-column field="NumStudents" label="Number of Students" numeric>
//                   {{ props.row.NumStudents }}
//                 </b-table-column>

//                 <b-table-column field="SectionAvg" label="Section Average" sortable>
//                   {{ props.row.SectionAvg }}
//                 </b-table-column>
//         </template>
//       </b-table>

//     </template>

//   </b-table>
</script>
