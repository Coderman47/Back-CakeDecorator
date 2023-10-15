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
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.STRING),
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
        type: DataTypes.ENUM("Presencial", "Grabado"),
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: {
            args: 40,
            msg: "El número máximo permitido es 40.",
          },
        },
      },
      currentStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      learnDescriptions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
    },
    {
      timestamps: false,
    }
  );
};
