export default (sequelize, DataTypes) => {
  var Course = sequelize.define('course', {
    // Should be the campus-like course identifier. Might be broken down.
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING
  })

  return Course
}
