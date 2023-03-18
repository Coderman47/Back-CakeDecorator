const { Router } = require("express");
const { User, Product } = require("../../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = Product.findAll();
    if (products === undefined) {
      console.log("Entre por si no hay products");
      throw new Error("No hay productos encontrados");
    }
    console.log("PRODUCTS", products);
    res.status(200).send(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, img, category } = req.body;
    console.log("VIENE POR BODY", req.body);
    if (name && description && price && stock && img && category) {
      const createProduct = Product.create(req.body);
      res
        .status(200)
        .send({ msg: `La categoria ${category} fue asignada satisfactoriamente`, createProduct });
    } else {
      throw new Error("Faltan campos para crear producto");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});

// router.put("/updateProduct", async (req, res) => {
//     try {

//     } catch (error) {

//     }
// });

module.exports = router;
