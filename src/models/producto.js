const mongoose = require("mongoose");

const productoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  urlFoto: {
    type: String,
    required: true
  },
  tallas: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  inicio: {
    type: Number,
    required: false
  }
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;