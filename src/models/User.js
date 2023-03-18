const { DataTypes, UUIDV4, STRING } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      availableCourses: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      productsUser: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "banned"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
