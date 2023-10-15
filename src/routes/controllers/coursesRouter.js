const { Course, User } = require("../../db");

const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const allCourses = await Course.findAll();
    res.status(200).send(allCourses);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.get("/getUserCourses", async (req, res) => {
  try {
    const userId = req.query.id;
    if (userId) {
      const userInfo = await User.findByPk(userId, {
        include: [
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
      const courses = userInfo.dataValues.courses;
      res.status(200).send(courses);
    } else {
      res.status(404).send("No hay usuario del ID para buscar sus cursos");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.get("/id", async (req, res) => {
  try {
    const courses = await Course.findByPk(req.query.id);

    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(200).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      videos,
      img,
      price,
      category,
      type,
      limit,
    } = req.body;
    if (
      title &&
      description &&
      duration &&
      img &&
      price &&
      category &&
      type &&
      limit
    ) {
      const newCourse = await Course.create(req.body);
      res.status(200).send({
        msg: `${category} del tipo ${type} creado con éxito`,
        newCourse,
      });
    } else {
      throw Error("Faltan datos para crear el curso");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.put("/", async (req, res) => {
  try {
    await Course.update(req.body, { where: { id: req.query.id } });
    res.status(200).send({ msg: "Curse modificado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.put("/buyCourses", async (req, res) => {
  try {
    const userId = req.query.id;
    const coursesId = req.body; //ARRAY DE IDS DE CURSOS

    if (userId) {
      const findUser = await User.findByPk(userId, {
        include: [
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
              "id",
            ],
          },
        ],
      });
      const cursos = findUser.dataValues.courses;
      if (coursesId.length > 0) {
        const cursosAgregados = [];
        coursesId.forEach(async (id) => {
          if (
            cursos.some(
              (curso) => curso.dataValues.user_course.dataValues.courseId === id
            )
          ) {
            console.log("Curso ya agregado");
          } else {
            await findUser.addCourse(id);
            cursosAgregados.push(await Course.findByPk(id));
          }
        });
        setTimeout(() => {
          res
            .status(200)
            .send(
              `CURSOS AGREGADOS: ${
                cursosAgregados.length > 0
                  ? cursosAgregados
                      .map((curso) => curso.dataValues.title)
                      .join(" | ")
                  : cursosAgregados.length === 0
                  ? `No se agregó nada`
                  : null
              }`
            );
        }, 500);
      } else {
        res.status(404).send(`No hay IDs de cursos para agregar`);
      }
    } else {
      res.status(404).send("No hay ID de usuario.");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
