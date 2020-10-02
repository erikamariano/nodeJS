//Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const admin = require('./routes/admin');

const path = require('path'); //serve para manipular pastas (trabalhar com diretórios)

const session = require('express-session');
const flash = require('connect-flash'); //o flash é um tipo bem curto de sessão, serve para salvar as coisas por um tempo, mas quando a página é atualizada some. Ideal para mostrar as msg de erro e sucesso.


//Configurações
    //Configurando as sessões
    app.use(session({
        secret: "cursodenode", //aqui pode ser escrito qualquer coisa
        resave: true,
        saveUnitialized: true
    }))
    app.use(flash())
    //Middleware para as sessões
    app.use((req, res, next) => {
        //Criando variáveis globais para mostrar msg para o usuário. Locals é para variáveis globais.
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next();
    })

    //Configurando BodyParser
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    //Configurando Handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}));
    app.set('view engine', 'handlebars');
    //Confuigurando Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp',{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Conectado ao Mongo!");
    }).catch((err) => {
        console.log("Erro ao se conectar ao Mongo: " + err);
    })

    //Configurando a pasta public
    app.use(express.static(path.join(__dirname, 'public')));

    //Criando um middleware
    //Precisa de um 'next' na função pois o midleware é uma 'parada' antes do servidor. Então o next avisa que pode continuar.
    //Middleware é chamado a cada requisição
    app.use((req, res, next) => {
        console.log("Este é o middleware!")
        next()
    })


//Rotas
app.use('/admin', admin); // criando um grupo de páginas com a rota admin.

//Outros
const PORT = 3031;
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
});