const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./src/config/db");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB();

app.use("/", require("./src/routes/products.routes"));
app.use("/", require("./src/routes/users.routes"));
app.use("/", require("./src/routes/auth.routes"));

// app.use("/api/users", require("./src/routes/users.routes"));
// app.use("/api/auth", require("./src/routes/auth.routes"));

app.get("/", (req, res) => res.send("UCAMP API"))

app.listen(process.env.PORT, () => {
  console.log("El servidor esta corriendo en el puerto 4000");
});
