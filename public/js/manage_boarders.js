const db = firebase.firestore();

const config = {
    apiKey: "AIzaSyDHt321Q9fjJEkTdTt8D7FKLArPLTkrrys",
    authDomain: "persevere-9b1cd.firebaseapp.com",
    databaseURL: "",
    projectId: "persevere-9b1cd",
    storageBucket: "persevere-9b1cd.appspot.com",
    messagingSenderId: "1094027429774",
    appId: "1:1094027429774:web:a44c5364dc15611afd06df",
    measurementId: "G-KERQPT5Q7X"
  };

var secondaryApp = firebase.initializeApp(config, "Secondary");

//Affichage User courant et affichage du nom dans le header
var nameUser;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      //console.log(user);
    }

    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var data = doc.data();
            var role = data.role;
            nameUser = data.name;
            document.getElementById("username").innerHTML = nameUser;
            //console.log("nameUSER : "+nameUser);
            
            //Si user est un "user"
            if(role == "user"){
                window.location.href = './accueil.html';
            }

            //Si user est un "pro"
            if(role == "pro"){
                window.location.href = './accueil_pro.html';
            }
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

//Remplissage de la liste listeUsers
const users3 = db.collection('users').get();
users3.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var name = data.name;
        var id = data.id;
        //console.log(id);
        //console.log(name);

        document.getElementById("listeUsers").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Ajouter un pensionnaire
const validateP = document.getElementById('validateP');
validateP.addEventListener('click', () => {

    //R??cup??ration des inputs
    const birthdate = document.getElementById('birthdate');
    const board_price = document.getElementById('board_price');
    const date_inscription = new Date().toLocaleDateString();
    const entry_date = document.getElementById('entry_date');
    const gender = document.getElementById('gender');
    const name = document.getElementById('name');
    const options = document.getElementById('options');
    const race = document.getElementById('race');
    const weight = document.getElementById('weight');
    const id = makePwd(20);

    //Ajout du pensionnaire ?? la base de donn??es
    db.collection("boarders").doc(id).set({
        id_user: listeUsers.options[listeUsers.selectedIndex].value,
        birthdate: birthdate.value,
        board_price: board_price.value,
        date_inscription: date_inscription,
        entry_date: entry_date.value,
        gender: gender.value,
        name: name.value,
        options: options.value,
        race: race.value,
        weight: weight.value,
        id: id,
    })
    .then(() => {
        
        alert("Le pensionnaire "+ name.value +" a ??t?? ajout??");
        birthdate.value = "";
        board_price.value = "";
        entry_date.value = "";
        gender.value = "";
        name.value = "";
        options.value = "";
        race.value = "";
        weight.value = "";
        location.reload();
    })
    .catch((error) => {
        alert(error);
    });
});

//Remplissage liste des Users Modifier
const usersBoardersM = db.collection('users').get();
usersBoardersM.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var id = data.id;

        document.getElementById("usersModifierListe").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Remplissage liste des Boarders modifier selon le user selectionn??
const usersModifierListe = document.getElementById('usersModifierListe');
usersModifierListe.addEventListener('click', () => {

    var boardersModifierListe = document.getElementById('boardersModifierListe');
    var idUserModifier = usersModifierListe.options[usersModifierListe.selectedIndex].value;

    //Clean
    for (var i=0; i < boardersModifierListe.length; i++) {
        boardersModifierListe.remove(i);
        boardersModifierListe.remove(0);
    }
    
    boardersModifierListe.selectedIndex = 0;

    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {

            var data = doc.data();
            var name = data.name;
            var id_user = data.id_user;
            var id = data.id;
    
            if(id_user == idUserModifier){
                document.getElementById("boardersModifierListe").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });
});

//Modification des informations
var idBoardersModifier;
const modifierU = document.getElementById('modifierU');
const listeUsersModifier = document.getElementById('listeUsersModifier');

//Pr??-remplissage des champs Modifier
boardersModifierListe.addEventListener('click', () => {
    idBoardersModifier = boardersModifierListe.options[boardersModifierListe.selectedIndex].value;

    var docRef = db.collection("boarders").doc(idBoardersModifier);
    docRef.get().then((doc) => {
        if (doc.exists) 
        {
            var data = doc.data();
            var birthdate = data.birthdate;
            var board_price = data.board_price;
            var entry_date = data.entry_date;
            var gender = data.gender;
            var name = data.name;
            var options = data.options;
            var race = data.race;
            var weight = data.weight;

            document.getElementById('birthdateM').value = birthdate;
            document.getElementById('board_priceM').value = board_price;
            document.getElementById('entry_dateM').value = entry_date;
            document.getElementById('genderM').value = gender;
            document.getElementById('nameM').value = name;
            document.getElementById('optionsM').value = options;
            document.getElementById('raceM').value = race;
            document.getElementById('weightM').value = weight;
            
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

//Update des informations
modifierM.addEventListener('click', () => {

    var idBoarderM = boardersModifierListe.options[boardersModifierListe.selectedIndex].value;

    var birthdate = document.getElementById('birthdateM').value;
    var board_price = document.getElementById('board_priceM').value
    var entry_date = document.getElementById('entry_dateM').value
    var gender = document.getElementById('genderM').value
    var name = document.getElementById('nameM').value
    var options = document.getElementById('optionsM').value
    var race = document.getElementById('raceM').value
    var weight = document.getElementById('weightM').value

    db.collection("boarders").doc(idBoarderM).update({
        birthdate: birthdate,
        board_price: board_price,
        entry_date: entry_date,
        gender: gender,
        name: name,
        options: options,
        race: race,
        weight: weight,
    })
    .then(() => {
        alert("Les informations du pensionnaire ont bien ??t?? modifi??es !");

        birthdate.value = "";
        board_price.value = "";
        entry_date.value = "";
        gender.value = "";
        name.value = "";
        options.value = "";
        race.value = "";
        weight.value = "";

        location.reload();
    })
    .catch(function(error) {
        alert(error);
    });
});
       
//Remplissage liste des Users Delete
const usersBoardersD = db.collection('users').get();
usersBoardersD.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var id = data.id;

        document.getElementById("listeUD").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Remplissage liste des Boarders modifier selon le user selectionn??
const listeUD = document.getElementById('listeUD');
listeUD.addEventListener('click', () => {

    var listeBoardersD = document.getElementById('listeBoardersD');
    var idUserD = listeUD.options[listeUD.selectedIndex].value;

    //Clean
    for (var i=0; i < listeBoardersD.length; i++) {
        listeBoardersD.remove(i);
        listeBoardersD.remove(0);
    }
    
    listeBoardersD.selectedIndex = 0;

    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {

            var data = doc.data();
            var name = data.name;
            var id_user = data.id_user;
            var id = data.id;
    
            if(id_user == idUserD){
                document.getElementById("listeBoardersD").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });
});

//Suppression d'un Pensionnaire
const deleteP = document.getElementById('deleteP');
deleteP.addEventListener('click', () => {
    var idBoarder = listeBoardersD.options[listeBoardersD.selectedIndex].value;

    //Suppresion de la base de donn??e
    db.collection("boarders").doc(idBoarder).delete().then(() => {
        alert("Le pensionnaire ?? bien ??t?? supprim??");
        location.reload();
    }).catch((error) => {
        alert.error("Error removing document: ", error);
    });
});

//G??n??rer un mot de passe al??atoire
function makePwd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Nombre total de pensionnaires
let cptP = 0;
const boarders = db.collection('boarders').get();
boarders.then((snap) => {
    snap.docs.forEach((doc) => {
        cptP++;
    })

    document.getElementById("nbrBoarders").innerHTML += `
    <!--Retour-->
    <div class="md:w-1/2 xl:w-1/3 p-1">
        
        <div class="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-600 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 transition duration-300">
            Nombre total de pensionnaires inscrits : <span class="font-bold">${cptP}</span>
        </div>
        
    </div>
    `;
});

//D??connexion
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});

