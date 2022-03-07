const express = require("express");
const cors = require("cors");
const server = express();

//routers
const departmentRouter = require("../api/departments/departmentsRouter");
const femmeRouter = require("../api/femmegineers/femmegineersRouter");

server.use(express.json());
server.use(cors());
server.use("/departments", departmentRouter);
server.use("/femme", femmeRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
