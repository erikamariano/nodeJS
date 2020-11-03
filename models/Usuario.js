//Modelo para cadastrar usuários no banco de dados

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ehAdmin: {
        type: Number,
        default: 0 //quando default for igual a 0, a pessoa não é admin.
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario);