class User{
    constructor(login, password){
        this.login = login;
        this.password = password;
    }
    
    getWarriorList(){
        fetch('http://127.0.0.1:3000/getWarriors/' + this.login, {method:'get'})
        .then(data =>  data.json())
        .then(results => displayWarriorList(results))
        .catch(err => {
            console.log('Error occured with fetching ressources : ' + err)
        })
    }

    displayWarriorList(data){
        console.log(JSON.stringify(data) || "Warrior list is empty, sorry bro !") // voir si on garde le json stringify
    }

}