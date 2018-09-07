import somefile from './student.js'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import * as globalConfig from '../config/config.json'
const config = globalConfig['sequelize']
const basename = path.basename(__filename)
const db = {}

// Create sequelize instance
const sequelize = new Sequelize(config.database, config.user, config.password, config)

// Read all files in firectory and add them as models to db
fs.readdirSync(__dirname)
  .filter(file => {
    // console.log(file)
    // console.log(filename)
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    // console.log(file)
    // console.log(typeof file)
    var model = somefile(sequelize, Sequelize)
    db[model.name] = model
  })

// Add model associations to db.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Add sequelize instances
db.sequelize = sequelize
db.Sequelize = Sequelize

// Export
export { db }
