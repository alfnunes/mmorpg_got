module.exports.jogo = function(application, req, res){
    if(!req.session.autorizado){        
          res.render('index',{validacao : {}});
          return;
    }
    
    let connection = application.config.dbConnection;
    let jogoDAO = new application.app.models.JogoDAO(connection);

    jogoDAO.iniciaJogo(req.session, res, req.query.msg);   
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err, result){
        res.render('index',{validacao : {}});
    });
}

module.exports.suditos = function(application, req, res){
    if(!req.session.autorizado){        
          res.render('index',{validacao : {}});
          return;
    }
    res.render('aldeoes',{validacao : {}});
}

module.exports.pergaminhos = function(application, req, res){
    if(!req.session.autorizado){        
          res.render('index',{validacao : {}});
          return;
    }

    let connection = application.config.dbConnection;
    let jogoDao = new application.app.models.JogoDAO(connection);

    let usuario = req.session.usuario;

    jogoDao.getAcoes(usuario, res);   
}

module.exports.ordernar_acao_sudito = function(application, req, res){
    if(!req.session.autorizado){        
          res.render('index',{validacao : {}});
          return;
    }

   let data = req.body;

   req.assert('acao','Ação deve ser informada').notEmpty();
   req.assert('quantidade','Quantidade deve ser informada').notEmpty();

   let errors = req.validationErrors();

   if(errors){
       res.redirect('jogo?msg=A');
       return;
   }

   let connection = application.config.dbConnection;
   let jogoDao = new application.app.models.JogoDAO(connection);
   
   data.usuario = req.session.usuario;
   jogoDao.acao(data);

   res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){
    
    if(!req.session.autorizado){        
          res.render('index',{validacao : {}});
          return;
    }

   let id = req.query.id_acao;

   let connection = application.config.dbConnection;
   let jogoDAO = new application.app.models.JogoDAO(connection);

   jogoDAO.revogarAcao(id, res);
}