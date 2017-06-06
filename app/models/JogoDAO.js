let objectId = require('mongodb').ObjectId;

function JogoDAO(connection){    
    this._conn = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
    this._conn.open(function(err, mongoClient){
        mongoClient.collection("jogo",function(err, collection){
            collection.insert({
                usuario : usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria:  Math.floor(Math.random() * 1000),
                comercio:  Math.floor(Math.random() * 1000),
                magia:  Math.floor(Math.random() * 1000)
            });
            mongoClient.close();
        });
    });   
}

JogoDAO.prototype.iniciaJogo = function(session, res, msg){
    this._conn.open(function(err, mongoClient){
        mongoClient.collection("jogo",function(err, collection){
            collection.find({usuario : session.usuario}).toArray(function(err, result){
                res.render('jogo',{imgCasa : session.casa, jogo : result[0], msg : msg});
                mongoClient.close();
            });            
        });
    });   
}

JogoDAO.prototype.acao = function(acao){
     this._conn.open(function(err, mongoClient){
        mongoClient.collection("acao",function(err, collection){
            let date = new Date();       
            let tempo = null;

            switch(parseInt(acao.acao)){
                case 1 :
                    tempo = 60 * 60000;
                    break;
                case 2 :
                    tempo = 2 * 60 * 60000;
                    break;
                case 3 :                   
                case 4 :
                    tempo = 5 * 60 * 60000;
                    break;
            }

            acao.acao_termina_em = date.getTime() + tempo;
            collection.insert(acao);           
        });

        mongoClient.collection("jogo",function(err, collection){            
            let moedas = null;

            switch(parseInt(acao.acao)){
                case 1 :
                    moedas = -2 * acao.quantidade;
                    break;
                case 2 :
                    moedas = -3 * acao.quantidade;
                    break;
                case 3 :                   
                case 4 :
                    moedas = -1 * acao.quantidade;
                break;
            }

            collection.update(
                {usuario : acao.usuario},
                {$inc : {moeda : moedas }}
            );
            mongoClient.close();
        });
    });   
}

JogoDAO.prototype.getAcoes = function(usuario, res){    
      this._conn.open(function(err, mongoClient){
        mongoClient.collection("acao",function(err, collection){
            let date = new Date();
            let momento_atual = date.getTime();

            collection.find({usuario : usuario, acao_termina_em : {$gt : momento_atual } }).toArray(function(err, result){               
                res.render('pergaminhos',{acoes : result});
                mongoClient.close();    
            });            
        });
    });   
}

JogoDAO.prototype.revogarAcao = function(id, res){    
      this._conn.open(function(err, mongoClient){
        mongoClient.collection("acao",function(err, collection){
          collection.remove(
              {_id : objectId(id)}, 
              function(err, result){
                res.redirect('/jogo?msg=D');
                mongoClient.close();
              }
          );
        });
    });   
}

module.exports = function (){
    return JogoDAO;
}