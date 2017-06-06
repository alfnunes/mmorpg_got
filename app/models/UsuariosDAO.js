let crypto = require('crypto');

function UsuariosDAO(connection){    
    this._conn = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
    this._conn.open(function(err, mongoClient){
        mongoClient.collection("usuarios",function(err, collection){
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex");
            collection.insert(usuario);
            mongoClient.close();
        });
    });   
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._conn.open(function(err, mongoClient){
        mongoClient.collection("usuarios",function(err, collection){
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex");
            collection.find(usuario).toArray(function(err, result){
               
                if(result[0] != undefined){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }

                if(req.session.autorizado){
                    res.redirect('jogo');
                }
                else{
                    res.render('index',{validacao : {}});
                }
            });
            mongoClient.close();
        });
    });   
}

module.exports = function (){
    return UsuariosDAO;
}