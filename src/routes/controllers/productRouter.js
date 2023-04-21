const { Router } = require("express");
const { User, Product } = require("../../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();

    if (products.length === 0) {
      res.status(404).send("No hay productos encontrados");
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/findOne/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    if (req.params.id) {
      const getProduct = await Product.findByPk(req.params.id);

      res.status(200).send(getProduct);
    } else {
      res.status(404).send("No hay ID del producto");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.get("/getUserProducts", async (req, res) => {
  try {
    const findUser = await User.findByPk(req.query.id, {
      include: [
        {
          model: Product,
          attributes: ["name", "price", "description", "img", "category"],
        },
      ],
    });
    if (findUser) {
      const products = findUser.dataValues.products;
      res.status(200).send(products);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, img, category } = req.body;
    console.log("PRICE: ", price);
    if (name && description && price && stock && img && category) {
      const createProduct = Product.create(req.body);
      res.status(200).send({
        msg: `El producto ${name} fue creado satisfactoriamente`,
      });
    } else {
      res.status(404).send({ error: "Faltan campos para crear producto" });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description, stock, img, price, category } = req.body;
  console.log("RUTA INDICADA");
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const finded = await Product.findByPk(id);
    if (finded) {
      await Product.destroy({
        where: { id: finded.id },
      });
      res.status(200).send(`Producto con ID ${id} eliminado correctamente`);
    } else {
      res.status(400).send(`El producto con ID ${id} no se encontró`);
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
