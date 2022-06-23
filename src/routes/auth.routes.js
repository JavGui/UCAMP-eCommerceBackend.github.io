const express = require('express')
const app = express.Router()
const Usuario = require("../models/usuario");
const router = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get("/", (req, res) => {
  res.send("Tu endpoint esta corriendo correctamente")
});


//--------------------------------------------------------------------------------------------------------------

app.post("/iniciar-sesion", async(req, res) => {
  const { email, password } = req.body
  try {
      let foundUser = await Usuario.find({ email })

      if(foundUser.length === 0){
        return await res.status(400).json({msg: "El usuario no existe"})
      } 

      const passCorrecto = await bcryptjs.compare(password, foundUser[0].password)

      if(!passCorrecto){
        return await res.status(400).json({msg: "Password incorrecto"})
      }
      
      const payload = { user: { id: foundUser.id }}

      jwt.sign(
        payload, 
        process.env.SECRET, 
            {
                expiresIn: 3600000
            }, (error, token) => {
                if(error) throw error;
                    res.json({ token, foundUser })
            }
        )      
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error", error})
    }
})

//--------------------------------------------------------------------------------------------------------------

app.get("/verificar-usuario", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.users.id).select('-password')
    res.json({usuario})
  } catch (error) {
      res.status(500).json({ msg: "Hubo un error", error })
  }
})

//------------------------------------------------------------------------------------------------------------

app.get("/confirmar-usuario", async (req, res) => {
  const { email } = req.body
  try {
    const users = await Usuario.find({ email })
    res.json({users})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

module.exports = app;
