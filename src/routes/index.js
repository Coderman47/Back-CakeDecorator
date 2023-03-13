const { Router } = require("express");
const router = Router();
const usersRouter = require("./controllers/usersRouter");
const coursesRouter = require("./controllers/coursesRouter");

//importar todos los controllers

//configurar los routers

router.use("/users", usersRouter);
router.use("/courses", coursesRouter);

module.exports = router;
