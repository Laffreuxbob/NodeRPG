// Server
const express = require('express');
const server = express();

const conf = require('./utils/config.js')
const pkg = require('./package.json'); // Pour pouvoir lire les data du package.json
const sha1 = require('sha1');

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body de la requete (post)

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

server.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})



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

// ------------------------------------------------CRUD USERS
// Method POST add new user
// curl -X POST -H "Content-Type: application/json" -d '{"newLogin":"NouveauProjet", "newPassword":"25-09-2019"}' http://localhost:3000/addUser
// curl -d "newLogin=test&newPassword=test" -X POST http://localhost:3000/addUser
server.post('/addUser',  function(req, res)  {
    const data = req.body    // recuperation des donnees dans le body de la requete
    console.log("REQ : ", data)
    let newLogin = data.newLogin;
    let newPassword = sha1(data.newPassword);
    console.log(newLogin, newPassword)
    let query = "INSERT INTO users (login, password) \
    VALUES ('" + newLogin + "','" + newPassword + "');"
    console.log(query);
    connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("User successfully added");
        res.status(200)
        connection.end();
        res.end();
    })
});

// Method DELETE  user
// curl -X DELETE http://127.0.0.1:3000/deleteUser/test
server.delete('/deleteUser/:login', function (req, res) {
    let query = "DELETE FROM users \
    WHERE login = '" + req.params.login + "';";
    console.log(query);
    connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log(results)
        console.log("User successfully deleted");
        res.status(403)
        connection.end();
        res.end();
    })
 });

// Methode GET login pour la connection
server.get('/login', function (req, res) {
    const sql = "SELECT * FROM users WHERE login = " + req.login + "AND password = " + req.password
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(!results){
            //pas de connexion
        }else{
            res.sendFile(__dirname + '/index.html'); // page d'accueil
        }
    });
    connection.end();
})

// Methode GET liste des personnages enregistrés
server.get('/listWarriors', function (req, res) {
    const sql = "SELECT * FROM warrior WHERE user = " + req.user;
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(!results){
            //pas de personnage disponible
        }else{
            res.send(results); // afficher la liste des personnage disponible
        }
    });
    connection.end();
})

// Method POST add new warrior
server.post('/add',  (req, res) => {
    const data = req.body    // recuperation des donnees dans le body de la requete
    // attribution des nouvelles key_value  
    let newBreed = data.newBreed || "default_breed"; 
    let newName = data.newName || "default_name"; 
    let newWeaponType = data.newWeaponType || "firstName";
    let newPromo = data.promo || "default_promo";
    
    // creation du nouvel objet tache 
    let newWarrior = {
        "breed":newName,
        "name":newFirstname,
        "hp":newPromo,
        "strength": 2,
        "itemPoints": 10,
    };


    switch(newBreed){
        case "human":
        let newWarriorObject = new Human(newName)
        console.log(newWarriorObject)
    }

    
    let query = "INSERT INTO warrior (breed, name, hp, strength, weapon) \
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