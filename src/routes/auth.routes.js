const express = require('express')
const app = express.Router()
const Users = require("../models/usuario");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Tu endpoint esta corriendo correctamente")
});


//--------------------------------------------------------------------------------------------------------------

app.post("/iniciar-sesion", async(req, res) => {
  const { email, password } = req.body

  try {
      let foundUser = await Usuario.findOne({ email })
      if(!foundUser){
          return res.status(400).json({msg: "El usuario no existe"})
      }      
      const passCorrecto = await bcryptjs.compare(password, foundUser.password)
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
                    res.json({token})
            }
        )
      
    } catch (error) {
        res.json({
            msg: "Hubo un error",
            error})
    }
})

//--------------------------------------------------------------------------------------------------------------

app.get("/verificar-usuario", async (req, res) => {

  try {
      const usuario = await Usuario.findById(req.user.id).select('-password')
      res.json({usuario})
  } catch (error) {
      res.status(500).json({
          msg: "Hubo un error",
          error
      })
  }
})
module.exports = app;
