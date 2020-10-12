//Documento para guardar todas as minhas rotas da página admin
const express = require("express");
const router = express.Router();

//Chamar um model que está em um documento externo
const mongoose = require('mongoose'); //isso é para a rota 'post', que vai add dados no db.
require('../models/Categoria'); //para chamar o modelo 'Categoria'. Os dois pontos (..) é para dizer que está uma pasta acima, e não na routes.
const Categoria = mongoose.model('categorias');

//Chamar o model de post
require('../models/Postagem');
const Postagem = mongoose.model('postagens');

//em vez de usar app.get, usa-se router.get
router.get('/', (req,res) => {
    res.render("admin/index")
})

// router.get('/post', (req,res) => {
//     res.send("Página de Posts!")
// })

router.get('/categorias', (req,res) => {
    //Mostrando as categorias já criadas
    //o sort{date:'desc'} é para listar por data de criação, mais nova para mais antiga.
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

    //Listar todas as postagens feitas:
    Postagem.find().populate('categoria').sort({data:"desc"}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens.map(postagens => postagens.toJSON())});
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar as postagens');
        res.redirect('/admin/postagens');
    })
    
})

router.get('/postagens/add', (req,res) => {
    //Mostrar todas as categorias criadas, para na hora da postagem poder escolher em qual se encaixa.
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagens', {categorias: categorias.map(categorias => categorias.toJSON())})
    }).catch((erro) => {
        req.flash('error_msg', 'Houve um erro ao carregar a lista de categorias.');
        res.redirect('/admin');
    })

    //res.render('admin/addpostagens');  //nome do file handlebars que tem as características da página.
})

router.post('/postagens/nova', (req,res) => {

    //validação (como coloquei o 'required' no frontend, a única validação agora será a do campo '0' de categorias)
    var erros = [];

    if(req.body.categoria == '0'){
        erros.push({texto: "Categoria inválida, registre novamente."})
    }

    if(erros.length > 0){
        res.render('admin/addpostagens', {erros: erros})
    }else{
        
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Post criado com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', "Erro ao salvar a postagem");
            res.redirect('/admin/postagens');
        })
    }
})

router.get('/postagens/edit/:id', (req,res) => {

    //Para os campos categorias aparecerem na hora de editar:
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem});
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar categorias');
            res.redirect('/admin/postagens');
        })

    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar formulário de edição, tente novamente.');
        res.redirect('/admin/postagens');
    })    
})

router.post('/postagens/edit', (req,res) => {

    //esse id que vai ser procurado é o mesmo que está no file 'editpostagens', no campo input value id (linha 11)
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash('success_msg', 'Post editado com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar edição, tente novamente.');
            res.redirect('/admin/postagens');
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar post, tente novamente.');
        res.redirect('/admin/postagens');
    })
})

router.post('/postagens/deletar', (req,res) => {

    //esse id que vai pegar é o mesmo do file 'postsgens' (linha 18)
    Postagem.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Post deletado com sucesso!');
        res.redirect('/admin/postagens');
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao deletar post, tente novamente.');
        res.redirect('/admin/categorias');
    })
})



module.exports = router;