const { Router } = require("express");
const { User, Product } = require("../../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();

    if (!products) {
      res.status(404).send({ error: "No hay productos encontrados" });
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, img, category } = req.body;
    if (name && description && price && stock && img && category) {
      const createProduct = Product.create(req.body);
      res.status(200).send({
        msg: `La categoria ${category} fue asignada satisfactoriamente`,
        createProduct,
      });
    } else {
      res.status(404).send({ error: "Faltan campos para crear producto" });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put("/updateOne/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description, stock, img, price, category } = req.body;
  try {
    const findProduct = await Product.findOne({ where: { id: id } });

    if (!findProduct) {
      res.status(400).send({ error: "No se encontró producto con ese ID" });
    }
    const newProduct = await findProduct.update({
      name,
      description,
      stock,
      img,
      price,
      category,
    });
    if (newProduct) {
      res.status(200).send(newProduct);
    } else {
      res.status(400).send({ error: "No se pudo actualizar correctamente" });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/deleteOne/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const finded = await Product.findByPk(id);
    if (finded) {
      await Product.destroy({
        where: { id: finded.id },
      });
      res.status(200).send("Producto eliminado correctamente");
    } else {
      res.status(400).send("El producto con ese ID no se encontró");
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
