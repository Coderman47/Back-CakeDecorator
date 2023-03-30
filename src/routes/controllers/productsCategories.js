const { Router } = require("express");
const router = Router();
const { Category } = require("../../db");
const validator = require("validator");

router.get("/", async (req, res) => {
  try {
    // console.log("ProductsCategories MODEL: ", Category);
    const categories = await Category.findAll();
    // console.log("categories: ", categories);
    res.status(200).send(categories);
  } catch (error) {
    res.status(404).send({ msg: "Error on get /categories" });
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { category } = req.body;
    if (!category || typeof category !== "string") {
      res
        .status(404)
        .send({ msg: "Falta el nombre de la categoria o no es una string" });
    } else {
      const categoryToUpperCase = `${
        category[0].toUpperCase() + category.slice(1).toLowerCase()
      }`;
      const newCategory = await Category.create({
        category: categoryToUpperCase,
      });
      res.status(200).send(newCategory);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    const isUUID = validator.isUUID(id);

    if (!id || !isUUID) {
      res
        .status(404)
        .send({ msg: "Falta el id o el id enviado no es un UUID." });
    } else {
      const categoryDeleted = await Category.destroy({ where: { id } });
      if (!categoryDeleted) {
        res
          .status(404)
          .send({ msg: "No se encontró ninguna categoría con ese ID" });
      } else {
        res.status(200).send({
          msg: `Se eliminó la Categoria exitosamente`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = router;
