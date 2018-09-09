// Dependencies
import Sequelize from 'sequelize'
import { config, logger } from '../config'
// Tables
import student from './student.js'
import assignment from './assignment.js'
import assignmentCategory from './assignmentCategory.js'
import user from './user.js'

const sqlConfig = config['sequelize']
const db = {}
db.tables = {}

const includedTableConstructors = {
  'student': student,
  'assignment': assignment,
  'assignmentCategory': assignmentCategory,
  'user': user
}

// Create sequelize instance
const sequelize = new Sequelize(sqlConfig.database, sqlConfig.user, sqlConfig.password, sqlConfig)

// NOTE: I would iterate over the files, but nodejs was really giving me trouble there.
for (var key in includedTableConstructors) {
  logger.info('Creating sequelize database table: ' + key)
  db.tables[key] = includedTableConstructors[key](sequelize, Sequelize.DataTypes)
}

// Stuff all the tables into the database object.
// Add model associations to db.
Object.keys(db.tables).forEach(modelName => {
  if (db.tables[modelName].associate) {
    db.tables[modelName].associate(db)
  }
})

// Add sequelize instances
db.sequelize = sequelize
db.Sequelize = Sequelize

// Export
export { db }
