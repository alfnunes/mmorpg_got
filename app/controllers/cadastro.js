module.exports.cadastro = function(application, req, res){
    res.render('cadastro',{validacao : {},dadosform : {}});
}

module.exports.cadastrar = function(application, req, res){
    let dados = req.body;

    req.assert('nome','Nome não pode ser vazio').notEmpty();
    req.assert('usuario','Usuário não pode ser vazio').notEmpty();
    req.assert('senha','Senha não pode ser vazio').notEmpty();
    req.assert('casa','Casa não pode ser vazio').notEmpty();
    
    let errors = req.validationErrors();

    if(errors){
        res.render('cadastro',{validacao : errors, dadosform : dados});       
    }

    let connection = application.config.dbConnection;
    let usuariosDao = new application.app.models.UsuariosDAO(connection);
    let jogoDAO = new application.app.models.JogoDAO(connection);
    
    usuariosDao.inserirUsuario(dados);
    jogoDAO.gerarParametros(dados.usuario);

    res.send('test');
}
