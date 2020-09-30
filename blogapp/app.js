//Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const admin = require('./routes/admin');

const path = require('path'); //serve para manipular pastas (trabalhar com diretórios)

//Configurações
    //Configurando BodyParser
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    //Configurando Handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}));
    app.set('view engine', 'handlebars');
    //Confuigurando Mongoose
    mongoose.Promise = global.Promisse;
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log("Conectado ao Mongo!");
    }) catch((err) => {
        console.log("Erro ao se conectar ao Mongo: " + err);
    })

    //Configurando a pasta public
    app.use(express.static(path.join(__dirname, 'public')));



//Rotas
app.use('/admin', admin); // criando um grupo de páginas com a rota admin.

//Outros
const PORT = 3031;
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
});