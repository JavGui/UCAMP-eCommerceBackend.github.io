const express = require('express')
const app = express.Router()
const Producto = require("../models/producto");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Tu endpoint esta corriendo correctamente");
});

//------------------------------------------------------------------------------------------------------------

app.post("/inicio-productos", async (req, res) => {
  console.log('Entré a inicio productos backend');
  const { inicio } = req.body
  try {
    const products = await Producto.find({ inicio })
    console.log('Regresé inicio: ', products);
    res.json({products})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

app.post("/obtener-productos", async (req, res) => {
  console.log('Entré a obtener productos backend');
  const { id } = req.body
  console.log('id: ', id);
  try {
    const products = id ? await Producto.find({ _id : id}) : await Producto.find({})
    console.log('Regresé de obtener: ', products);
    res.json({products})
  } catch (error) {
      res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
  }
})

app.post("/crear-producto", async (req, res) => {
  const { nombre, descripcion, urlFoto, tallas, color, precio } = req.body
  try{
    const productos = await Producto.create({ nombre, descripcion, urlFoto, tallas, color, precio, inicio: 0 })
    res.json(productos);
  }catch (error) {
    res.status(500).json({ msg: "Error loading data from Database" });
  }
})

app.put("/actualizar-producto", async (req, res) => {
  const {id, nombre, descripcion, urlFoto, tallas, color, precio, inicio } = req.body;
  try {
    const productos = await Producto.findByIdAndUpdate( id, { nombre, descripcion, urlFoto, tallas, color, precio, inicio }, { new: true });
    res.json(productos);    
  } catch (error) {
    res.status(500).json({
      msg: "Error loading data from Database",
    });
  }
});

app.delete("/borrar-producto", async (req, res) => {
  const { id } = req.body;
  try {
    const productos = await Producto.findByIdAndRemove({ _id : id });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      msg: "Error loading data from Database",
    });
  }
});

module.exports = app;
