const { User, Product } = require("../../db");

const { Router } = require("express");
const { Course } = require("../../db");
const router = Router();

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
router.post("/userEmail", async (req, res) => {
  try {
    //? Esta ruta es para preguntar a la DB si existe un usuario con el email con el que estan intentando ingresar
    const user = await User.findOne({
      where: { email: req.body.userEmail },
      // include: [{ model: Course }],
    });
    // console.log("FIND USER: ", user);
    user !== null ? res.status(200).send(true) : res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, surname, email, password, role, status } = req.body;
    if (name && surname && email && password && role && status) {
      const newUser = await User.create(req.body);
      res.status(200).send(newUser);
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
    //? ESTA RUTA TIENE 2 CAMINOS, SI POR BODY ME LLEGA LA PROP "addCourse" HACE ES LO SIGUIENTE:
    console.log("addCourse: ", req.body.addCourse);
    if (req.body.addCourse === true) {
      //? ↓↓ BUSCO AL USUARIO QUE HAY QUE MODIFICAR
      const userToAddCourses = await User.findByPk(req.query.userId);
      //? ↓↓ TMB ME LLEGA UNA PROPIEDAD "coursesIds" CON LA CUAL BUSCO Y GUARDO LOS CURSOS QUE HAY QUE AGREGARLE AL USER
      const coursesToAdd = await Course.findAll({
        where: { id: req.body.coursesIds },
      });

      await userToAddCourses.addCourse(coursesToAdd);
      res.status(200).send(userToAddCourses);
    } else {
      //? ESTE ES EL CAMINO EN EL QUE SOLO SE MODIFICA AL USUARIO POR PETICION DEL MISMO, POR INFO PERSONAL
      const userUpdated = await User.update(req.body, {
        where: { id: req.query.userId },
      });
      userUpdated[0] === 1
        ? res.status(200).send(userUpdated)
        : res.status(404).send("No hay usuario con ese ID");
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
