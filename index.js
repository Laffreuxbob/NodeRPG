// Server
const express = require('express');
const server = express();

// Utils
const conf = require('./utils/config.js')
const pkg = require('./package.json'); // Pour pouvoir lire les data du package.json
const sha1 = require('sha1');

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body des requetes (post)


const Elf = require('./src/js/Elf.js')
const Human = require('./src/js/Human.js')

const User = require('./src/js/User.js')

// const p5 = require('p5')

console.log(__dirname)
server.use('/cssFiles', express.static(__dirname + '/src/css'));
server.use('/imgServer', express.static(__dirname + '/src/img'));
server.use('/pageServer', express.static(__dirname + '/src/pages'));
server.use('/scriptServer', express.static(__dirname + '/src/js'));

// let elf1 = new Elf("testelf")
// console.log(elf1)
// let h1 = new Human("testelf")
// console.log("-------------",h1);
// h1.usePotion();
// console.log("-------------",h1);

// let user1 = new User("log","pswd")
// console.log(user1)

//const io = require('socket.io').listen(server); // Pour que socketio écoute notre serveur

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

server.use((req, res, next) => {
    res.header('Content-Type', 'text/html');
    next();
})

// BDD
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : conf.hosturl,
    user     : conf.DB_user,
    password : conf.DB_pswd,
    database : conf.DB_name
});

// Facon presque propre d'eviter le probleme de header CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
server.use(allowCrossDomain);

// Methode GET pour charger la premiere page d'accueil
server.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

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
    res.send("Version : " + JSON.stringify(pkg.version));  
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
    //console.log("QUERY TEST => ", queryTest)
    connection.query(queryTest, function (err, results, fields) {
        if(err) throw err;
        // console.log("results => ", results)
        // console.log("resultsL => ", results.length)
        if(results.length > 0){
            console.log('add nope')
            res.send("Login already exists")
        }else{
            console.log('add yes')
            let query = "INSERT INTO users (login, pswd) \
            VALUES ('" + newLogin + "','" + newPassword + "');"
            console.log("QUERY add user => ", query);
            connection.query(query, function (err, results, fields) {
                if (err) throw err;
                console.log("User successfully added");
                res.status(200)
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
server.get('/login/:log/:psd', function (req, res) {
    const {
        params: {
            log,
            psd
        }
    } = req
    const sql = "SELECT * FROM users WHERE 'login' = " + log + "AND 'password' = " + sha1(psd) + ";";
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(!results){
            //pas de connexion
            console.log("nope")
        }else{
            res.sendFile(__dirname + '/index.html'); // page d'accueil
        }
    });
    connection.end();
})

// Methode POST login pour la connection
// curl -d "login=bob&password=bob" -X POST http://localhost:3000/login
server.post('/login', (req, res) => {
    const data = req.body;
    const sql = "SELECT * FROM users WHERE login = '" + data.login + "' AND pswd = '" + sha1(data.password) + "';"
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        console.log("RESULTS ==> ", results);
        if(results.length > 0){
            if (results){
                console.log("You are now connected !");
                //res.send("You are now connected !");
                res.sendFile(__dirname + '/pageServer/creationCharacter.html');
            }
        }else{
            console.log("Wrong login or password");
            res.send("Wrong login or password");
        }
    })
})


// ------------------------------------------------CRUD WARRIORS


// Methode GET liste des personnages enregistrés
// curl http://127.0.0.1:3000/listWarriors
server.get('/listCharacter.html', function (req, res) {
    const sql = "SELECT * FROM warriors";
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;        
        if(results.length > 0){
            if (results){
                console.log(results);
                res.send(results);
            }
        }else{
            console.log("Empty list");
            res.send("Pas de warrior disponible");
        }
    });
    
})

// Methode GET selectionner un personnage
// curl 127.0.0.1:3000/selectWarrior/bob
server.get('/selectWarrior/:warriorSelect', function (req, res) {
    const sql = "SELECT * FROM warriors WHERE name = '" + req.params.warriorSelect + "';";
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        if(results.length > 0){
            if (results){
                console.log(results);
                res.send(results);
            }
        }else{
            console.log("No name");
            res.send("Erreur de selection");
        }
    });
})

// Method POST add new warrior
/* INSERT INTO `warriors` (`id`, `breed`, `name`, `hp`, `strength`, `healingItem`, `dodgingChance`, `weaponEquiped`, `user`) 
VALUES (NULL, 'human', 'bob', '10000000', '10000000', '0', '0', 'sword', 'bob');*/
// curl -d "newBreed=elf&newName=Legolas" -X POST http://localhost:3000/creationCharacter.html
server.post('/creationCharacter.html',  (req, res) => {
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
    
    let query = "INSERT INTO warriors (breed, name, hp, strength, healingItem, dodgingChance, weaponEquiped, user) \
    VALUES ('" + newBreed + "','" + newName + "','50','50','2','0.2','cleaver','bob');"
    connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("Success add");
        res.status(200)
        res.send(newWarriorObject)
    })
});

// Method DELETE  user
// curl -X DELETE http://127.0.0.1:3000/deleteUser/test
server.delete('/deleteWarrior/:id', function (req, res) {
    let deleteId = req.params.id;
    let query = "DELETE FROM warriors \
    WHERE id = '" + deleteId + "';";
    console.log(query);
    connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log(results)
        console.log("Warrior successfully deleted");
        res.status(403)
        connection.end();
        res.end();
    })  
});

// io.sockets.on('connection',function(socket, player){

//     socket.on('new_player', function(player){
//         socket.player = player;
//         socket.broadcast.emit('new_player', player);
//     });

//     socket.on('dammage', function(dammage){
//         socket.broadcast.emit('dammage', {player : socket.player, dammage: dammage})
//     });

// });

server.listen(conf.port, conf.hostname, function() {   
    console.log('Server running at http://' + conf.hosturl + ':' + conf.port + '/');
});