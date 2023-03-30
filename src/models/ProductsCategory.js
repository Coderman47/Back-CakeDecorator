const { DataTypes, UUID, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "category",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      //   id: {
      //     type: DataTypes.UUID,
      //     allowNull: false,
      //     primaryKey: true,
      //     defaultValue: UUIDV4,
      //   },
    },
    {
      timestamps: false,
    }
  );
};
