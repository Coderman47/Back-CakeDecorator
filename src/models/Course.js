const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "course",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      videos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("Seminario", "Curso"),
      },
      type: {
        type: DataTypes.ENUM("Presencial", "Online", "Hibrido"),
        allowNull: false,
      },
      // rating: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   validate: {
      //     min: 1,
      //     max: 5,
      //   },
      // },

      // level: {
      //   type: DataTypes.ENUM("Principiante", "Intermedio", "Avanzado"),
      //   allowNull: false,
      // },
    },
    {
      timestamps: false,
    }
  );
};
