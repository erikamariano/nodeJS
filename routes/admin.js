//Documento para guardar todas as minhas rotas da página admin
const express = require("express");
const router = express.Router();

//Chamar um model que está em um documento externo
const mongoose = require('mongoose'); //isso é para a rota 'post', que vai add dados no db.
require('../models/Categoria'); //para chamar o modelo 'Categoria'. Os dois pontos (..) é para dizer que está uma pasta acima, e não na routes.
const Categoria = mongoose.model('categorias');

//em vez de usar app.get, usa-se router.get
router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/post', (req,res) => {
    res.send("Página de Posts!")
})

router.get('/categorias', (req,res) => {
    //Mostrando as categorias já criadas
    //o sort{date:'desc'} é ára listar por data de criação, main nova para mais antiga.
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias.map(categorias => categorias.toJSON())});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente.");
        res.redirect('/admin');
    })  
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

    //Validando dados do formulário
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        //add objeto ao array (com 'push')
        erros.push({texto: "Nome Inválido!"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "A categoria deve conter pelo menos 2 caracteres."});
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros});
    } else{
        //variável que vai receber os dados do formulário
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        } 

        //Criar um objeto dentro da classe Categoria
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente.");
            res.redirect('/admin');
        })
    }   
})

router.get('/categorias/edit/:id', (req,res) => {
    
        Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {  //para os campos já virem preenchidos na hora de editar.
        res.render('admin/editcategorias', {categoria: categoria});    
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe!');
        res.redirect('/admin/categorias');
    }) 
})

router.post('/categorias/edit', (req,res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar edições!');
            res.redirect('/admin/categorias');
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria!');
        res.redirect('/admin/categorias');
    })
})

router.post('/categorias/deletar', (req,res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria.');
        res.redirect('/admin/categorias');
    })
})

router.get('/postagens', (req,res) => {
    res.render('/admin/postagens');
})

module.exports = router;