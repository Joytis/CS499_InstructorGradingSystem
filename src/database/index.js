// Dependencies
import Sequelize from 'sequelize'
import { config } from '../config'
// Tables
import Student from './student.js'
import Assignment from './assignment.js'
import AssignmentCategory from './assignmentCategory.js'
import User from './user.js'
import Course from './course.js'
import Section from './section.js'
import Grade from './grade.js'
import Term from './term.js'

const sqlConfig = config['sequelize']
const db = {}
db.models = {}

// Create sequelize instance
const sequelize = new Sequelize(sqlConfig.database, sqlConfig.user, sqlConfig.password, sqlConfig)

// NOTE: I originally used loops for this, but it was just kind of silly and unnecessary.
db.models.student = Student(sequelize, Sequelize.DataTypes)
db.models.user = User(sequelize, Sequelize.DataTypes)
db.models.course = Course(sequelize, Sequelize.DataTypes)
db.models.section = Section(sequelize, Sequelize.DataTypes)
db.models.grade = Grade(sequelize, Sequelize.DataTypes)
db.models.assignmentCategory = AssignmentCategory(sequelize, Sequelize.DataTypes)
db.models.assignment = Assignment(sequelize, Sequelize.DataTypes)
db.models.term = Term(sequelize, Sequelize.DataTypes)

// Add model associations to db.
Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db)
  }
})

// Add sequelize instances
db.sequelize = sequelize
db.Sequelize = Sequelize

// Export
export { db }
