const express = require("express");
const morgan = require("morgan");
const router = require("./routes/index.js");
const cors = require("cors");

// Para leer data del .env
// import * as dotenv from 'dotenv'
// dotenv.config()

const server = express();

//options for cors middleware
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

server.use("/", router);

module.exports = server;
