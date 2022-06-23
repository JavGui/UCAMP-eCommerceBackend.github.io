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
    console.log('Recibí Login: ', email, password );
  try {

      let foundUser = await Usuario.find({ email })
      console.log('foundUser ', foundUser);
      console.log('foundUser.length: ', foundUser.length);

      if(foundUser.length === 0){
        console.log('entré a usuario no existe')
        return await res.status(400).json({msg: "El usuario no existe"})
      } 

      const passCorrecto = await bcryptjs.compare(password, foundUser[0].password)

      if(!passCorrecto){
        console.log('entré a password incorrecta');
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
                    console.log("token: ", token)
                    res.json({token})
            }
        )      
    } catch (error) {
        console.log('Entré al catch de inicio de sesión');
        console.log("Error", error)
        res.status(500).json({ msg: "Hubo un error", error})
    }
})

//--------------------------------------------------------------------------------------------------------------

app.get("/verificar-usuario", async (req, res) => {
  console.log('entré a verificar usuario');
  // console.log('req.user.id: ', req.users.id );
  try {
    console.log('entré al try de verificar: ');
    // const usuario = await Usuario.findById(req.users.id).select('-password')
    // console.log('verifica usuario: ', usuario);
    // res.json({usuario})
  } catch (error) {
    console.log('entré al catch de verificar: ', error);
      res.status(500).json({
          msg: "Hubo un error",
          error
      })
  }
})

//------------------------------------------------------------------------------------------------------------

app.get("/confirmar-usuario", async (req, res) => {
  const { email } = req.body
  console.log('recibí confirmar: ', email);
  try {
    const users = await Usuario.find({ email })
    console.log('res users: ', users);
    res.json({users})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

module.exports = app;
