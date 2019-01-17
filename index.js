// Server
const express = require('express');
const server = express();

// Utils
const conf = require('./utils/config.js')
const pkg = require('./package.json'); // Pour pouvoir lire les data du package.json
const sha1 = require('sha1');

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body des requetes (post)
const server = express();
const io = require('socket.io').listen(server); // Pour que socketio écoute notre serveur

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

// Methode GET all users
// curl http://127.0.0.1:3000/allUsers
server.get('/allUsers', (req, res) => {
    let queryTest = "SELECT * FROM users";
    console.log(queryTest)
    connection.query(queryTest, function (err, results, fields) {
        console.log("results : ", results)
        res.send(results)
    })
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
    // On vérifie que le login n'existe pas deja
    let queryTest = "SELECT * FROM users WHERE login = '" + newLogin + "'";
    connection.query(queryTest, function (err, results, fields) {
        console.log("results : ", results)
        console.log("type : ", typeof results)
        if(results != null){
            res.send("Login already exists")
        }else{
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
        }
    })
});

// Method DELETE  user
// curl -X DELETE http://127.0.0.1:3000/deleteUser/test
server.delete('/deleteUser/:login', function (req, res) {
    let deleteLogin = req.params.login;
    // On ne peut pas supprimer Bob, le super admin / le user test hehe
    if(deleteLogin === 'bob'){
        res.send('cant delete Bob')
    }else{
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
    }
   
 });

// Methode GET login pour la connection
server.get('/login', function (req, res) {
    const sql = "SELECT * FROM users WHERE login = " + req.login + "AND password = " + sha1(req.password)
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

server.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    connection.connect(function(err) {
      if (err) {
        throw err;
      }
      console.log("Connected!");
    });
  });

// Methode GET liste des personnages enregistrés
server.get('/listWarriors', function (req, res) {
    const sql = "SELECT * FROM warriors WHERE user = " + req.user;
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(!results){
            res.send("pas de personnage disponible");
            connection.end();
        }else{
            res.send(results); // afficher la liste des personnage disponible
            connection.end();
        }
    });
})

// Methode GET selectionner un personnage
server.get('/selectWarrior/:warriorSelect', function (req, res) {
    const sql = "SELECT * FROM warriors WHERE " + req.params.warriorSelect;
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(!results){
            res.send("Erreur de selection");
            connection.end();
        }else{
            res.send(results); // afficher la liste des personnage disponible
            console.log("FIGHT");
            connection.end();
        }
    });
})

// Method POST add new warrior
server.post('/addWarrior',  (req, res) => {
    const data = req.body    // recuperation des donnees dans le body de la requete
    let newBreed = data.newBreed || "default_breed"; 
    let newName = data.newName || "default_name"; 
    let newHp = data.newHp || 200;
    let newStrength = data.newStrength || 10;
    let newHealingItem = data.newHealingItem || 0;
    let newDodgingChance = data.newDodgingChance || 0;
    let newWeaponType = data.newWeaponType || "sword";
    let newWarriorUser = data.newWarriorUser || "bob";
    // creation du nouvel objet tache 
    let newWarrior = {
        "breed":newBreed,
        "name":newName,
        "hp":newHp,
        "strength": newStrength,
        "dodgingChance": newDodgingChance,
        "healingItem": newHealingItem,
        "itemPoints": 10,
        "weapon": newWeaponType,
        "user": newWarriorUser
    };

    let newWarriorObject;
    switch(newBreed){
        case "human":
        newWarriorObject = new Human(newWarrior.name, newWarrior.user)
        break;
        case "elf":
        newWarriorObject = new Elf(newWarrior.name, newWarrior.user)
    }

    let query = "INSERT INTO warrior (breed, name, hp, strength, healingItem, dodgingChance, weaponEquiped, user) \
    VALUES ('" + newBreed + "','" + newName + "');"
    connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("Success add");
        res.status(200)
        res.send(newWarriorObject)
    })
});

io.sockets.on('connection',function(socket, player){

    socket.on('new_player', function(player){
        socket.player = player;
        socket.broadcast.emit('new_player', player);
    });

    socket.on('dammage', function(dammage){
        socket.broadcast.emit('dammage', {player : socket.player, dammage: dammage})
    });

});

server.listen(conf.port, conf.hostname, function() {   
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/');
});