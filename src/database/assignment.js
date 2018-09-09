export default (sequelize, DataTypes) => {
  var Assignment = sequelize.define('assignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    dateCreated: { type: DataTypes.STRING, defaultValue: DataTypes.NOW }
  })

  return Assignment
}
