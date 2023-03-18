const { Router } = require("express");
const router = Router();
const usersRouter = require("./controllers/usersRouter");
const coursesRouter = require("./controllers/coursesRouter");
const productRouter = require("./controllers/productRouter");

//importar todos los controllers

//configurar los routers

router.use("/users", usersRouter);
router.use("/courses", coursesRouter);
router.use("/products", productRouter);

module.exports = router;
