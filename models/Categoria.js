//Para cadastrar categorias no banco de dados

const mongoose = require('mongoose');
const Schema = mongoose.Schema; //para facilitar na hora da digitação e não ficar escrevendo 'mongoose.schema' sempre.

const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {    //slug funciona como a URL da categoria. Ex: slug = marketing - admin/categorias/marketing
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria); //esse 'categorias' vai ser chamado no arquivo de routes. E é o nome da classe a ser criada.

