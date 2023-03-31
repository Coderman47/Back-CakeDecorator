const { User, Product } = require("../../db");
const { Router } = require("express");
const { Course } = require("../../db");
const router = Router();
const { sendMessageMail, sendMailToRecoveryPass } = require("../../utils/mailer");
const bcryptjs = require("bcryptjs");
const { HOST_FRONT } = require("../../utils/index");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Product, //Codigo para generar los arreglos vacios e ir guardando la data relacionada entre modelos.
          attributes: [
            "name",
            "description",
            "stock",
            "price",
            "img",
            "category",
          ],
        },
        {
          model: Course, //Codigo para generar los arreglos vacios e ir guardando la data relacionada entre modelos.
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
    // console.log("USERS", users[0].products[0])
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

router.get("/verifyAccount", async (req, res) => {
  const userId = req.query.id;
  const findUser = await User.findByPk(userId);
  if (findUser) {
    const updateStatus = await findUser.update({ status: "active" });
    res.status(200).send(`
    <h2 align="center">¡Tu cuenta se ha verificado correctamente, muchas gracias!👍</h2>
    <font size="6">
    <center>
    <a href=${HOST_FRONT}/>Ir al inicio del Mundo Dulce de Marite</a>
    </center>
    </font>
    `);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, surname, email, password, role, status } = req.body;
    if (name && surname && email && password && role && status) {
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

router.put("/buyProducts/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const productsIds = req.body; //Recibe un array de objetos con el ID de los productos seleccionados.
    const findUser = await User.findByPk(userId);

    if (findUser) {
      if (productsIds.length > 0) {
        const productsToAdd = await Product.findAll({
          where: { id: productsIds },
        });
        await findUser.addProduct(productsToAdd);
        res.status(200).send("Articulos agregados al usuario!");
      } else {
        res.status(404).send(`Falta el ID del producto para relacionarlo`);
      }
    } else {
      res.status(404).send(`No se encontró usuario con ID ${userId}`);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
