//Documento para guardar todas as minhas rotas da página admin
const express = require("express");
const router = express.Router();

//em vez de usar app.get, usa-se router.get
router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/post', (req,res) => {
    res.send("Página de Posts!")
})

router.get('/categorias', (req,res) => {
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

module.exports = router;