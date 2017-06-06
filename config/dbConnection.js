const mongo = require('mongodb');

let connMongoDB = function(){
    let db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost',
            27017,
            {}
        ),
        {}
    );

    return db;
}

module.exports = function(){
   return connMongoDB;
}