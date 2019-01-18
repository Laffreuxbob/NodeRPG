function user_connection(){
    console.log("test")
}

// FORMULAIRE DE CONNEXION

<form action="http://127.0.0.1:3000/login" method="POST" enctype="multipart/form-data">
<input type="text" name="login" size="50"/>
<br/>
<input type="text" name="password"/>
<input type="submit" name="submitConnection"/>
</form>


// FORMULAIRE DE CREATION DE WARRIOR
const formBreed = document.getElementById("breedChoice"); /* Start : choix de la race */
let newWarrior = {}; /* Creation d'un objet vide qui recupere toutes les datas entrées ds le formulaire */
formBreed.addEventListener("submit",  () => {   // ou click ?
    newWarrior = {
        'breed': formBreed.nodeValue, // value ou node value ?
        'name': '',
        'otherAttributes':[]
    }
    // next page une fois la race choisie
})

const formName = document.getElementById("nameChoice");
// Pour chaque formulaire / input, on implémente la nouvelle valeur dans le champ correspondant
// de l'objet newWarrior
formName.addEventListener("click",  () => {
    newWarrior['name'] = formName.value  // value ou node value
    // next page en fonction de comment on veut gerer le formulaire
    // single page ou non
})

// etc

// DERNIER BUTTON DU FORMULAIRE qui appelle une methode qui fetch sur notre server.post/add
// ===>  <button onclick="createWarrior()">FIGHT</button>

// FONCTION QUI FETCH et qui envoie nos dataS new warrior du front au back
function createWarrior(){
    fetch('http://127.0.0.1:3000/addWarrior/', {
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "newBreed": newWarrior['breed'], 
            "newName": newWarrior['name'], 
            "newHp": newWarrior['hp'], 
            "newStrength": newWarrior['strength'], 
            "newDodgingChance": newWarrior['dodgingChance'],
            "newhealingItem": newWarrior['healingItem'],
            "newWeaponType": newWarrior['weapon'],
            "newWarriorUser": newWarrior['user'],
        })
        })
        .then(response => {return (response.status === 200) ? response.json() : Promise.reject("Nom deja existant");})
        .catch(err => console.log("erreur : ", err)) // POPUP
}
