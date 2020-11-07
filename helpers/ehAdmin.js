//verificar se um usuário está autenticado e se ele é admin

module.exports = {
    ehAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.ehAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Você deve estar logado para entrar aqui");
        res.redirect("/");
    }
}