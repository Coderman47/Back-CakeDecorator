const { DataTypes, UUID, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
