// Server
const express = require('express');
const conf = require('./utils/config.js')
const pkg = require('./package.json'); // Pour pouvoir lire les data du package.json

const server = express();


// BDD
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'rpg'
});

// Facon presque propre d'eviter le probleme de header CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
server.use(allowCrossDomain);


// Methode GET pour recuperer la version du projet
// curl http://127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('Version: ' + pkg.version);
    res.send(JSON.stringify(pkg.version));  
})

// Method POST add new warrior
server.post('/add',  (req, res) => {
    const data = req.body    // recuperation des donnees dans le body de la requete
    // attribution des nouvelles key_value  
    let newName = data.name || "default_name"; 
    let newFirstname = data.newFirstname || "firstName";
    let newPromo = data.promo || "default_promo";
    
    // creation du nouvel objet tache 
    let newWarrior = {
        "breed":newName,
        "name":newFirstname,
        "hp":newPromo,
        "strength": 2,
        "itemPoints": 10,
    };
  
    let query = "INSERT INTO students (nom, prenom, promo) \
    VALUES (" + newStudent.name + "," + newStudent.firstname + "," + newStudent.promo + ";)"
    connection.query(query, function (err, results, fields) {
      if (err) throw err;
      console.log("Success add");
      res.status(200)
    })
  });

server.listen(conf.port, conf.hostname, function() {   
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/');
  });