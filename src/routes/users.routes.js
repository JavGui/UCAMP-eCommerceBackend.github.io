const express = require('express')
const app = express.Router()
const Users = require("../models/usuario");
const router = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get("/", (req, res) => {
  res.send("Tu endpoint esta corriendo correctamente");
});

//--------------------------------------------------------------------------------------------------------------

app.get("/obtener-usuarios", async (req, res) => {
  const { id } = req.body
  console.log('Recibí GET id: ', id);
  try {
    const users = id ? await Usuario.find({ _id : id}) : await Usuario.find({})
    console.log('Regresé GET: ', users);
    res.json({users})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

//--------------------------------------------------------------------------------------------------------------

app.post("/crear-usuario", async (req, res) => {
  const { nombre, apellido, email, password } = req.body
  console.log('Recibí POST: ',nombre, apellido, email, password );
  try{
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const respuestaDB = await Usuario.create({ nombre, apellido, email, password: hashedPassword })
    console.log('Crear Usuario: ', respuestaDB.password);

    const payload = { user: { id: respuestaDB._id}}

    jwt.sign( 
      payload, process.env.SECRET, { expisresIn: 360000 },
      (error, token) => {
        if (error) throw error
          res.json({ token })
      }
    )
  } catch (error) {
    return res.status(400).json({ msg: "Error loading data from Database" });
  }
})

//--------------------------------------------------------------------------------------------------------------

app.put("/actualizar-usuario", async (req, res) => {
  const {id, nombre, apellido, email, password } = req.body;
  try {
    const users = await Usuario.findByIdAndUpdate( id, { nombre, apellido, email, password }, { new: true });
    console.log('Regresé PUT; ', users);
    res.json(users);    
  } catch (error) {
    res.status(500).json({
      msg: "Error loading data from Database",
    });
  }
});

//--------------------------------------------------------------------------------------------------------------

app.delete("/borrar-usuario", async (req, res) => {
  const { id } = req.body;
  try {
    const users = await Usuario.findByIdAndRemove({ _id : id });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      msg: "Error loading data from Database",
    });
  }
});

module.exports = app;
