function user_connection(){
    console.log("test")
}


<form action="http://127.0.0.1:3000/login" method="POST" enctype="multipart/form-data">
<input type="file" name="login" size="50"/>
<br/>
<input type="submit" name="password"/>
</form>

const formBreed = document.getElementById("breedChoice");
formBreed.addEventListener("submit",  () => {// ou click ?
    let newWarrior = {
        'breed': formBreed.nodeValue, // value ou node value ?
        'name': '',
        'otherAttributes':[]
    }
    //next page
})

const formName = document.getElementById("nameChoice");
formName.addEventListener("click",  () => {
    newWarrior['name'] = formName.value  // value ou node value
    //next page
})

// etc

<form action="http://127.0.0.1:3000/addWarrior" method="POST" enctype="multipart/form-data">
<input type="file" name="login" size="50"/>
<br/>
<input type="submit" name="password"/>
</form>

// comment envoyer le reste des data ?