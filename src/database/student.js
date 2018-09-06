module.exports = function (sequelize, DataTypes) {
  var Student = sequelize.define('student', {
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  })

  // Force a sync
  return Student
}
