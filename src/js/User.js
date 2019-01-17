class User{
    constructor(login, password){
        this.login = login;
        this.password = password;
    }
    // Recuperer la liste de warriors d'un utilisateur
    getWarriorList(){
        fetch('http://127.0.0.1:3000/getWarriors/' + this.login, {method:'get'})
        .then(data =>  data.json())
        .then(results => displayWarriorList(results))
        .catch(err => {
            console.log('Error occured with fetching ressources : ' + err)
        })
    }

    // Afficher la liste de warriors d'un utilisateur
    displayWarriorList(data){
        console.log(JSON.stringify(data) || "Warrior list is empty, sorry bro !") // voir si on garde le json stringify
    }

    // Selectionner un warrior pour le combat
    selectWarrior(warriorSelect){
        fetch('http://127.0.0.1:3000/selectWarrior/' + warriorSelect, {method:'get'})
        .then(data =>  data.json())
        .then(results => displayWarriorList(results))
        .catch(err => {
            console.log('Error occured with fetching ressources : ' + err)
        })
    }

    // AFficher le warrior selectionner
    displayWarrior(warrior){
        console.log(warrior)
        let myWarrior = (warrior.breed = "human") ? new Human(warrior.name) : new Elf(warrior.name)  
        console.log(JSON.stringify(myWarrior))
    }
};

module.exports = User