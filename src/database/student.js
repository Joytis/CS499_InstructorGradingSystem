export default (sequelize, DataTypes) => {
  var Student = sequelize.define('student', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  })

  // Force a sync
  return Student
}
