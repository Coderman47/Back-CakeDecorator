const { Router } = require("express");
const router = Router();
const { Brand } = require("../../db");
const validator = require("validator");

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.findAll();
    brands.length
      ? res.status(200).send(brands)
      : res.status(404).send({ msg: "There is no brands to show" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("BRAND POST NAME: ", name);
    if (!name) {
      res.status(404).send({ msg: "Data is missing to create a new brand" });
    } else {
      const newBrand = await Brand.create({ name });
      res.status(200).send(newBrand);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
module.exports = router;
