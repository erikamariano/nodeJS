const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    }
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'categorias' //nome que demos para o modelo de Categorias (linha 21, file Categorias).
        required: true
    }
    data:{
        type: Date,
        default: Date.now()
    }
})

//Criando o nome do model (ou seja, o nome que será chamado em outros arquivos, e o nome da collection do Mongo):
mongoose.model('postagens', Postagem);