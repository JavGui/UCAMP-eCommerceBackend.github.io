const express = require('express')
const app = express.Router()
const Usuario = require('../models/usuario');
const router = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get("/", (req, res) => {
  res.send("Tu endpoint esta corriendo correctamente");
});

//------------------------------------------------------------------------------------------------------------

app.get("/obtener-usuarios", async (req, res) => {
  const { id } = req.body
  try {
    const users = await Usuario.find({ _id : id})
    res.json({users})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

//--------------------------------------------------------------------------------------------------------------

app.post("/crear-usuario", async (req, res) => {
  const { nombre, email, password } = req.body
  console.log('recibi crea: ', nombre, email, password);
  try{
    let foundEmail = await Usuario.find({ email })
    console.log('found Email: ', foundEmail);
    console.log('found length: ', foundEmail.length);

    if(foundEmail.length > 0){
       return res.status(400).json({msg: "Esta cuenta de correo ya existe"})
    }      

    const salt = await bcryptjs.genSalt(10)    
    const hashedPassword = await bcryptjs.hash(password, salt)
    const usuarioAgregado = await Usuario.create({ nombre, email, password: hashedPassword })
    const payload = { user: { id: usuarioAgregado._id}}

    jwt.sign( 
      payload, process.env.SECRET, { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error
          console.log('token: ', token);
          res.json({ token })
      }
    )
  } catch (error) {
    return res.status(400).json({ msg: "Error loading data from Database" });
  }
})

//--------------------------------------------------------------------------------------------------------------

app.put("/actualizar-usuario", async (req, res) => {
  const {id, nombre, email, password } = req.body;
  try {
    const users = await Usuario.findByIdAndUpdate( id, { nombre, email, password }, { new: true });
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
