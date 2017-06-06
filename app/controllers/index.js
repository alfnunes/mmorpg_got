module.exports.index = function(application, req, res){
    res.render('index',{validacao : {}});
}

module.exports.autenticar = function(application, req, res){
    let dados = req.body;

    req.assert('usuario','Usuário não pode ser vazio').notEmpty();
    req.assert('senha','Senha não pode ser vazia').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.render('index',{validacao : errors});
        return;
    }

    let usuariosDao = new application.app.models.UsuariosDAO(application.config.dbConnection);

    usuariosDao.autenticar(dados, req, res);  
}