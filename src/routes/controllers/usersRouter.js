const { User, Product } = require("../../db");
const { Router } = require("express");
const { Course } = require("../../db");
const router = Router();
const {
  sendMessageMail,
  sendMailToRecoveryPass,
} = require("../../utils/mailer");
const bcryptjs = require("bcryptjs");
const { HOST_FRONT } = require("../../utils/index");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Product,
          attributes: [
            "name",
            "description",
            "stock",
            "price",
            "img",
            "categories",
          ],
        },
        {
          model: Course,
          attributes: [
            "title",
            "description",
            "videos",
            "img",
            "price",
            "category",
            "type",
          ],
        },
      ],
    });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.get("/userId", async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId, {
      include: [{ model: Course }],
    });
    // console.log("USER: ", user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
router.get("/userEmail", async (req, res) => {
  try {
    //? Esta ruta es para preguntar a la DB si existe un usuario con el email con el que estan intentando ingresar
    const email = req.query.email;
    const user = await User.findOne({
      where: { email },
      // include: [{ model: Course }],
    });
    user !== null ? res.status(200).send(user) : res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.get("/forgotPassword", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      await sendMailToRecoveryPass(user);
      res.status(200).send(user);
    } else {
      console.log("No tengo a ese usuario en la DB");
      res.status(200).send();
    }
  } catch (error) {
    res.status(404).json(`${error.message}`);
  }
});

router.put("/updateUserPass", async (req, res) => {
  try {
    const { newPassword, id } = req.body;
    const pwHash = await bcryptjs.hash(newPassword, 11);
    const findUser = await User.findByPk(id);
    if (findUser && pwHash.length > 20) {
      await findUser.update({ password: pwHash });
      res.status(200).send(findUser);
    } else {
      throw new Error("Algo salió mal");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.get("/verifyAccount", async (req, res) => {
  try {
    const userId = req.query.id;
    const findUser = await User.findByPk(userId);
    if (findUser) {
      await findUser.update({ status: "active" });
      res.status(200).send(`
      <h2 align="center">¡Tu cuenta se ha verificado correctamente, muchas gracias!👍</h2>
      <font size="6">
      <center>
      <a href=${HOST_FRONT}/>Ir al inicio del Mundo Dulce de Marite</a>
      </center>
      </font>
      `);
    } else {
      res.status(404).send("Ups! Algo salio mal");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, surname, email, password, role, status } = req.body;
    if (name && surname && email && password && role && status) {
      req.body.registerDate = new Date();
      const pwHash = await bcryptjs.hash(password, 11);
      const newUser = await User.create({ ...req.body, password: pwHash });
      res.status(200).send(newUser);
      try {
        const { email, name } = req.body;
        const verifyLink = newUser["dataValues"].id;
        await sendMessageMail(email, name, verifyLink)
          .then((result) => res.status(200).send(result))
          .catch((error) => console.log(error.message));
      } catch (error) {
        res.status(400).send(error.message);
      }
    } else {
      throw Error("Falta algun dato para la creación del usuario");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.put("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const userUpdated = await User.update(req.body, {
        where: { id: req.query.userId },
      });
      userUpdated[0] === 1
        ? res.status(200).send(userUpdated)
        : res.status(404).send("No hay usuario con ese ID");
    } else {
      res.status(404).send({ msg: "Falta el ID del usuario para modificarlo" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.get("/getUserQuery", async (req, res) => {
  try {
    const getUserInfo = await User.findByPk(req.query.id);
    if (getUserInfo) {
      res.status(200).send(getUserInfo);
    } else {
      res.status(404).send("No se encontró usuario con dicho ID");
    }
  } catch (error) {
    res.status(404).send("Algo salió mal");
  }
});

router.put("/updateMyAccount", async (req, res) => {
  try {
    if (req.query.id) {
      const findUser = await User.findByPk(req.query.id);
      if (findUser) {
        const userUpdated = await findUser.update(req.body);
        res.status(200).send(userUpdated);
      }
    } else {
      res.status(404).send("Usuario no encontrado con ese ID");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.get("/usersStats", async (req, res) => {
  try {
    let allUsers = await User.findAll();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = router;
