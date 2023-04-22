const { Router } = require("express");
const router = Router();
const { Brand } = require("../../db");
const validator = require("validator");

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.findAll();
    brands.length ? res.status(200).send(brands) : res.status(200).send([]);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("req.body: ", req.body);
    if (!name) {
      res.status(404).send({ msg: "Data is missing to create a new brand" });
    } else {
      const brandToUpperCase = `${
        name[0].toUpperCase() + name.slice(1).toLowerCase()
      }`;
      const newBrand = await Brand.create({ brand: brandToUpperCase });
      res.status(200).send(newBrand);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
router.delete("/", async (req, res) => {
  try {
    const { id } = req.query;
    const isUUID = validator.isUUID(id);
    if (!id || !isUUID) {
      res
        .status(404)
        .send({ msg: "Falta el id o el id enviado no es un UUID." });
    } else {
      const brandDeleted = await Brand.destroy({ where: { id } });
      if (!brandDeleted) {
        res
          .status(404)
          .send({ msg: "No se encontró ninguna marca con ese ID" });
      } else {
        res.status(200).send({
          msg: `Se eliminó una marca exitosamente`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = router;
