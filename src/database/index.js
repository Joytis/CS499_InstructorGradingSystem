var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
var config = require('../config/config.json')['sequelize']
var db = {}

// Create sequelize instance
const sequelize = new Sequelize(config.database, config.user, config.password, config)

// Read all files in firectory and add them as models to database
fs.readdirSync(__dirname)
  .filter(file => {
    console.log(file)
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

// Add model associations to database.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Add sequelize instances
db.sequelize = sequelize
db.Sequelize = Sequelize

// Export
module.exports = db
