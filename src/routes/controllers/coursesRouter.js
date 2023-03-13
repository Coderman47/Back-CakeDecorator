const { Course } = require("../../db");

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
    const { title, description, videos, img, price, category, type } = req.body;
    if (title && description && videos && img && price && category && type) {
      const newCourse = await Course.create(req.body);
      res
        .status(200)
        .send({
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
module.exports = router;
