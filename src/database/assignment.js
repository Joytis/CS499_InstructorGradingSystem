export default (sequelize, DataTypes) => {
  var Assignment = sequelize.define('assignment', {
    // Data values
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING, notNull: true },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    dueDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // references
    assignmentCategoryRef: {
      type: DataTypes.INTEGER,
      notNull: true,

      references: {
        model: 'assignmentCategories',
        key: 'id'
      }
    }
  })

  return Assignment
}
