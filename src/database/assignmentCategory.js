export default (sequelize, DataTypes) => {
  var AssignmentCategory = sequelize.define('assignmentCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      validate: { min: 0.0, max: 1.0 }
    }
  })

  return AssignmentCategory
}
