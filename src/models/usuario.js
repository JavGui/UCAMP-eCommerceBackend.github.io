// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const usuarioSchema = mongoose.Schema({
	nombre: {
	  type: String,
	  required: true
	},
	email: {
	  type: String,
	  required: true
	},
	password: {
	  type: String,
	  required: true
	}
  });

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;