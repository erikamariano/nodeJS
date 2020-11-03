//Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const admin = require('./routes/admin');
const usuarios = require('./routes/usuario');

const path = require('path'); //serve para manipular pastas (trabalhar com diretórios)

const session = require('express-session');
const flash = require('connect-flash'); //o flash é um tipo bem curto de sessão, serve para salvar as coisas por um tempo, mas quando a página é atualizada some. Ideal para mostrar as msg de erro e sucesso.

//Chamar o model de postagens para aparecer na página home:
require('./models/Postagem');
const Postagem = mongoose.model('postagens');

//Chamar o model de categorias para visualizar sem estar logado:
require("./models/Categoria");
const Categoria = mongoose.model('categorias');


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
    //Configurando Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp',{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Conectado ao Mongo!");
    }).catch((err) => {
        console.log("Erro ao se conectar ao Mongo: " + err);
    })

    //Configurando a pasta public
    //Isso faz com que o express crie automaticamente rotas para todos os arquivos da pasta puclic.
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
app.use('/usuarios', usuarios);  //criando um grupo de páginas com a rota usuarios.


//Rota principal
app.get('/', (req,res) => {
    Postagem.find().populate('categoria').lean().sort({data:'desc'}).then((postagens) => {
        res.render('index', {postagens: postagens});
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar posts, tente novamente.');
        res.redirect('/404');
    })    
})

//Ver as categorias criadas (sem ser pelo admin. O admin será a visão de quando o usuário estiver logado)
app.get("/categorias", (req,res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias: categorias});
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno ao listar as categorias');
        res.redirect('/');
    })
})

app.get('/categorias/:slug', (req,res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){
            
            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria});
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao listar os posts. Tente novamente.");
                res.redirect('/categorias');
            })

        }else{
            req.flash('error_msg', 'Esta categoria não existe.');
            res.redirect('/categorias');
        }
    }).catch((err) => {
    req.flash('error_msg', "Erro interno. A categoria não foi encontrada. Tente novamente.");
    res.redirect('/categorias');
    })
})

//Ler a postagem escolhida
app.get('/postagem/:slug', (req,res) => {
    Postagem.findOne({slug: req.params.slug}).lean().populate('categoria').then((postagem) => {
        if(postagem){
            res.render("postagem/index", {postagem: postagem});
        } else{
            req.flash("error_msg", "Esta postagem não existe.");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Erro interno. A postagem não foi encontrada. Tente novamente.");
        res.redirect("/");
    })
})

//Rota de erro 404
app.get('/404', (req,res) => {
    res.send('Erro 404!');
})

//Outros
const PORT = 3031;
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
});